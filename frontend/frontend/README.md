# AI Knowledge Agent

An AI-powered Knowledge Management System built using FastAPI, React, PostgreSQL, Gemini AI, and Qdrant.

---

## Features

- User Registration & Login
- JWT Authentication
- Upload PDF, DOCX, TXT Documents
- Automatic Text Extraction
- Text Chunking
- Gemini Embeddings
- Qdrant Vector Database
- AI Question Answering
- Document Management
- Dashboard
- Protected Routes

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Uvicorn

### AI
- Google Gemini
- Qdrant Vector Database

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend/frontend

npm install

npm run dev
```

---

## API Endpoints

### Authentication

POST /auth/register

POST /auth/login

### Documents

POST /documents/upload

GET /documents

DELETE /documents/{id}

GET /documents/stats

### Chat

POST /chat/

---

## Folder Structure

backend/
frontend/
README.md

---

## Author

Your Name