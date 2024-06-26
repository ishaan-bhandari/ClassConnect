from flask import Flask, jsonify
import json
import re
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

app = Flask(__name__)


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
    return text


def segment_transcript(data, num_questions):
    total_words = len(data)
    segments = []
    end_times = []
    current_segment = []
    words_per_question = total_words // num_questions
    word_count = 0

    for word in data:
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


@app.route('/generate-questions', methods=['GET'])
def generate_questions():
    with open('sample_transcript.json', 'r') as file:
        data = json.load(file)

    total_words = len(data)
    total_questions = total_words // 750
    segments, end_times = segment_transcript(data, total_questions)

    load_dotenv()
    questions = []
    model = ChatOpenAI(
        openai_api_key=os.getenv("OPENAI_API_KEY"))

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

    return jsonify(timestamps)


if __name__ == '__main__':
    app.run(debug=True)
