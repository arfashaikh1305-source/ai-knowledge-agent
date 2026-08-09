from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config.settings import settings

from app.database.base import Base
from app.database.session import engine

# Import models
from app.database.models import User
from app.documents.models import Document

# Import routers
from app.auth.router import router as auth_router
from app.documents.router import router as document_router
from app.chat.router import router as chat_router

# Import Qdrant collection creator
from app.core.vector_store import create_collection


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)


app = FastAPI(title=settings.APP_NAME)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://your-actual-frontend.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create PostgreSQL tables
Base.metadata.create_all(bind=engine)


# Create Qdrant collection
create_collection()


# Register routers
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }