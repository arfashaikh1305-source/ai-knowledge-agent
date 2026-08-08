import os
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.documents.models import Document
from app.documents.extractor import extract_text
from app.documents.chunker import chunk_text


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_document(file: UploadFile, db: Session):
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
            "Unsupported file type. Allowed: PDF, TXT, DOCX, MD, PPTX, XLSX."
        )

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    extracted_text = extract_text(file_path)

    # Save document in PostgreSQL
    document = Document(
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

    # Temporarily skip embedding generation and Qdrant storage.
    # We are testing the document upload + PostgreSQL pipeline first.
    print("Document chunks created successfully!")
    print(
        f"Embedding generation temporarily disabled. "
        f"Chunks: {len(chunks)}"
    )

    return document


def get_all_documents(db: Session):
    documents = db.query(Document).all()

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
        }
        for doc in documents
    ]


def delete_document(document_id: int, db: Session):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        return {
            "message": "Document not found"
        }

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }