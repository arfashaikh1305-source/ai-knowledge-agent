import os
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.documents.models import Document
from app.documents.extractor import extract_text
from app.documents.chunker import chunk_text

from app.core.embedding_service import generate_embedding
from app.core.vector_store import (
    store_embedding,
    delete_document_embeddings,
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_document(
    file: UploadFile,
    db: Session,
    user_id: int,
):
    allowed_extensions = [
        ".pdf",
        ".txt",
        ".docx",
        ".md",
        ".pptx",
        ".xlsx",
    ]

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise ValueError(
            "Unsupported file type. Allowed: "
            "PDF, TXT, DOCX, MD, PPTX, XLSX."
        )

    # Save uploaded file
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Extract text
    extracted_text = extract_text(file_path)

    # Save document in PostgreSQL
    document = Document(
        user_id=user_id,
        filename=file.filename,
        file_type=file.content_type,
        file_path=file_path,
        content=extracted_text,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    print("Document saved successfully!")

    # Split extracted text into chunks
    chunks = chunk_text(extracted_text)

    print(f"Total chunks: {len(chunks)}")

    # Generate Gemini embeddings and store in Qdrant
    for index, chunk in enumerate(chunks):
        print(
            f"Processing chunk "
            f"{index + 1}/{len(chunks)}"
        )

        try:
            embedding = generate_embedding(
                chunk,
                task_type="RETRIEVAL_DOCUMENT",
            )

            store_embedding(
                document_id=document.id,
                user_id=user_id,
                chunk_id=index,
                text=chunk,
                embedding=embedding,
            )

        except Exception as e:
            print(
                f"Qdrant/embedding error for chunk "
                f"{index}: {e}"
            )
            raise

    print("All embeddings stored successfully!")

    return document


def get_all_documents(
    db: Session,
    user_id: int,
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == user_id)
        .all()
    )

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
        }
        for doc in documents
    ]


def delete_document(
    document_id: int,
    db: Session,
    user_id: int,
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == user_id,
        )
        .first()
    )

    if not document:
        return {
            "message": "Document not found"
        }

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete the document's embeddings from Qdrant
    delete_document_embeddings(
        document_id=document.id,
        user_id=user_id,
    )

    # Delete the document from PostgreSQL
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }