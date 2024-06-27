from flask import Flask, jsonify, request
import json
import re
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import requests
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
# from langchain.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
import openai
from dotenv import load_dotenv
import os
import shutil

import argparse
# from dataclasses import dataclass
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv

app = Flask(__name__)
CHROMA_PATH = "chroma"

transcript_list = []
transcript = ""

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def generate_data_store():
    transcript = " ".join(transcript_list)
    documents = Document(page_content=transcript)
    chunks = split_text(documents)
    save_to_chroma(chunks)


def split_text(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    document = chunks[10]
    print(document.page_content)
    print(document.metadata)

    return chunks


def save_to_chroma(chunks):
    # Clear out the database first.
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    # Create a new DB from the documents.
    db = Chroma.from_documents(
        chunks, OpenAIEmbeddings(), persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")


@app.route('/test')
def test():
    print(request.headers)

    query_text = request.args.get('query_text')
    print(query_text)
    return "hello bitch"


@app.route('/query_rag_model', methods=['GET'])
def query_rag_model():

    print(request.headers)

    query_text = request.args.get('query_text')

    print("here", query_text)

    embedding_function = OpenAIEmbeddings()

    db = Chroma(persist_directory=CHROMA_PATH,
                embedding_function=embedding_function)

    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    if len(results) == 0 or results[0][1] < 0.7:
        print(f"Unable to find matching results.")
        return

    print("here2", results)

    context_text = "\n\n---\n\n".join(
        [doc.page_content for doc, _score in results])

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    print(prompt)
    model = ChatOpenAI()
    response_text = model.predict(prompt)

    print(prompt)
    return jsonify(response_text), 200


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def segment_transcript(data, num_questions):
    total_words = len(data)
    segments = []
    end_times = []
    current_segment = []
    words_per_question = total_words // num_questions
    word_count = 0

    for word in data:
        transcript_list.append(word['w'])
        if word_count < words_per_question:
            current_segment.append(word['w'])
            word_count += 1
        else:
            segments.append(' '.join(current_segment))
            end_times.append(word['e'] // 1000)
            current_segment = []
            word_count = 0
    if current_segment:
        segments.append(' '.join(current_segment))
        end_times.append(word['e'] // 1000)
    generate_data_store()
    return segments, end_times


def parse_response(response):
    lines = response.split('\n')
    question_line = lines[0]
    answer_choices = lines[1:5]
    correct_answer_line = lines[5]

    question = question_line
    choices = [choice.split(') ')[1] for choice in answer_choices]
    correct_answer = correct_answer_line.split('Correct answer: ')[1]

    parsed_array = {
        "Question": question,
        "A": choices[0],
        "B": choices[1],
        "C": choices[2],
        "D": choices[3],
        "Correct": correct_answer
    }
    return parsed_array


def generate_questions():
    with open('sample_transcript.json', 'r') as file:
        data = json.load(file)

    total_words = len(data)
    total_questions = total_words // 750
    segments, end_times = segment_transcript(data, total_questions)

    load_dotenv()
    questions = []
    model = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))

    for segment in segments[:4]:
        prompt = f"""
        You are a teacher. Generate one relevant multiple-choice question based on the information delimited by triple quotes below.
        Provide four answer choices and indicate the correct answer.
        
        Make sure the question starts directly without prefacing it with any other text.

        Follow the example format below

        Example format: 

        What color is the sky?
        A) Blue
        B) Green
        C) Purple
        D) Yellow
        Correct answer: A

        '''{segment}'''
        """
        response_text = model.predict(prompt)
        questions.append(response_text)

    timestamps = {}
    for i, question in enumerate(questions):
        parsed = parse_response(question)
        timestamps[end_times[i]] = parsed

    return jsonify(timestamps), 200


@app.route('/get_transcript', methods=['GET'])
def get_transcript():
    link = request.headers.get('Transcript-Url')
    if not link:
        return jsonify({"error": "Transcript-Url header is missing"}), 400

    try:
        response = requests.get(link)
        response.raise_for_status()
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 400

    try:
        with open('transcript.json', 'w') as file:
            json.dump(response.json(), file)
    except (ValueError, IOError) as e:
        return jsonify({"error": str(e)}), 500

    return generate_questions()


if __name__ == '__main__':
    app.run(debug=True)
