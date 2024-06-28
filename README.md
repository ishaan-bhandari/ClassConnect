# Class Connect

## Project Summary

Class Connect is an interactive MediaSpace Chrome Extension designed to enhance video learning by incorporating interactive elements. It leverages LLM-generated questions and a RAG (Retrieval-Augmented Generation) system using a Chroma vector database and the text-embedding-3-large embedding model. 

- **1st Place Overall, Seamless Integration Award @ UIUC Research Park Hackathon 2024**

## Key Features & Technical Implementation

### 1. LLM-Generated Questions

**Transcription:**
- Web scrape the transcript directly from the video page.

**Question Generation:**
- Divide the transcript into sections of approximately 750 tokens (equivalent to ~5 minutes of video).
- Utilize the OpenAI API to generate random multiple-choice questions for each section.
- Insert the generated questions at calculated timestamps.
- Display the corresponding question on the screen when the video playback reaches the end of each section.

### 2. User-Submitted Questions and Answers

**Questions:**
- Enable users to submit questions at any time.

**RAG System:**
- Use cosine similarity on the transcript to retrieve relevant sections for answering questions.
- Generate answers using GPT-3.5 Turbo 🚀 based on retrieved information.

## Technical Architecture
![technical_architecture](https://github.com/ishaan-bhandari/ClassConnect/assets/66647978/d06213be-21a7-480a-8c71-2bf2f708d2ef)

## Development Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask, Python, Langchain, OpenAI, Webscraping
- **LLM Integration:** OpenAI API, Cosine Similarity, Vector Database, RAG (Retrieval Augmented Generation), LangChain
- **Chrome Extension:** Chrome Extensions API

## Potential Extensions

### Community Interaction
- Display submitted questions and allow users to add answers via a simple comment system.
- Enable users to upvote and downvote answers to highlight the most helpful responses.
- Allow users to follow specific discussions or topics for updates.

### Advanced Analytics
- Track user engagement and performance metrics.
- Provide reports on question performance and user interaction.

## Setup

Install all necessary requirements from the `requirements.txt`.

```bash
pip install -r requirements.txt
```

### API Key
First, you must obtain an OpenAI API key from [here](https://platform.openai.com/docs/overview). Create an `.env` file

```
OPENAI_API_KEY = <OPENAI_API_KEY>
```

### Flask App

To run the Flask app run the following commands

```bash
cd FlaskApp
flask run
```

### Chrome Extension

Follow the following developer tools to set up a Chrome Extension: [here](https://developer.chrome.com/docs/extensions/get-started)


## Video Demo
https://youtu.be/i7vJvzvM7Zo

## Contributors

- Harsh Bishnoi (harshitbishnoi2301@gmail.com)
- Santyanash Yeluri (santyanashyeluri@gmail.com)
- Ishaan Bhandari (ishaanbhandari0@gmail.com)
- Sai Merneedi (smerneedi3@gmail.com)
- Nishk Patel (nishkdpatel@gmail.com)
- Jai Rajpal (jairajpal13@gmail.com)



