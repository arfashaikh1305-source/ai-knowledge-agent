\# AI Knowledge Agent



An AI-powered Knowledge Management System that allows users to upload documents, search their content using semantic retrieval, and ask questions using an AI assistant.



The system combines a React frontend, FastAPI backend, PostgreSQL, Qdrant vector search, and Google Gemini.



\## Live Application



\- Frontend: https://ai-knowledge-agent-frontend.onrender.com

\- Backend: https://ai-knowledge-agent-backend.onrender.com



\## Features



\- User registration and login

\- JWT-based authentication

\- Protected application routes

\- PDF, DOCX, and TXT document upload

\- Automatic document text extraction

\- Document chunking

\- Gemini-powered text embeddings

\- Semantic vector search with Qdrant

\- Retrieval-Augmented Generation (RAG)

\- AI-powered document question answering

\- Document management

\- Document statistics/dashboard

\- Document download

\- AI-generated document summaries



\## Architecture



```text

&#x20;                        AI Knowledge Agent

&#x20;                               |

&#x20;                +--------------+--------------+

&#x20;                |                             |

&#x20;                v                             v

&#x20;         React + Vite                    FastAPI

&#x20;         Frontend                       Backend API

&#x20;                |                             |

&#x20;                |                    +--------+--------+

&#x20;                |                    |        |        |

&#x20;                |                    v        v        v

&#x20;                |               PostgreSQL Qdrant  Gemini

&#x20;                |                    |        |        |

&#x20;                +--------------------+--------+--------+

&#x20;                                         |

&#x20;                                         v

&#x20;                                 RAG Question Answering

\## RAG Flow



```text

Document Upload

&#x20;     |

&#x20;     v

Text Extraction

&#x20;     |

&#x20;     v

Text Chunking

&#x20;     |

&#x20;     v

Gemini Embeddings

&#x20;     |

&#x20;     v

Qdrant Vector Database

&#x20;     |

&#x20;     |

User Question

&#x20;     |

&#x20;     v

Question Embedding

&#x20;     |

&#x20;     v

Semantic Search

&#x20;     |

&#x20;     v

Relevant Document Chunks

&#x20;     |

&#x20;     v

Gemini

&#x20;     |

&#x20;     v

Answer

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- bcrypt
- Uvicorn

### AI and Search

- Google Gemini
- Gemini Embeddings
- Qdrant Vector Database
- Retrieval-Augmented Generation (RAG)

### Deployment

- Render
- PostgreSQL
- Qdrant Cloud

## Project Structure

```text
ai-knowledge-agent/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── config/
│   │   ├── core/
│   │   ├── database/
│   │   └── documents/
│   └── requirements.txt
│
├── frontend/
│   └── frontend/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
│
├── docs/
└── .gitignore

## Local Development

### Backend

From the project root:

```bash
cd backend
python -m venv venv

## API Endpoints

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Log in and receive an access token

### Documents

- `POST /documents/upload` — Upload a document
- `GET /documents/` — Get uploaded documents
- `DELETE /documents/{id}` — Delete a document
- `GET /documents/stats` — Get document statistics
- `GET /documents/download/{id}` — Download a document

### Chat

- `POST /chat/` — Ask questions about uploaded documents

### Health

- `GET /` — Backend welcome endpoint
- `GET /health` — Health check

## Security

The application uses:

- JWT authentication
- bcrypt password hashing
- Environment variables for API keys and database credentials
- Environment-based JWT secret
- CORS configuration for local and production frontend origins

Secrets and `.env` files should never be committed to Git.

## Production Deployment

The application is deployed on Render.

### Frontend

https://ai-knowledge-agent-frontend.onrender.com

### Backend

https://ai-knowledge-agent-backend.onrender.com

### Production Services

- Frontend: Render
- Backend: Render
- Database: PostgreSQL
- Vector Database: Qdrant Cloud
- AI: Google Gemini

The backend connects to PostgreSQL for application data, Qdrant for vector search, and Gemini for embeddings and AI-generated responses.

## Example Questions

After uploading a document, users can ask questions such as:

- What is this document about?
- What are the main topics covered in this document?
- What are the main functions of soil mentioned in the document?
- How does soil sealing affect rainwater infiltration?
- What is Land Use and Land Cover Change (LUCC)?

## Author

Afnan Shaikh