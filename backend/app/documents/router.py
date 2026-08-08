from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.documents.models import Document
from app.documents.service import (
    save_document,
    get_all_documents,
    delete_document,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    document = save_document(file, db)

    return {
        "message": "Document uploaded successfully",
        "id": document.id,
        "filename": document.filename,
    }


@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
):
    return get_all_documents(db)


@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    return delete_document(document_id, db)


@router.get("/stats")
def document_stats(
    db: Session = Depends(get_db),
):
    total_documents = db.query(Document).count()

    return {
        "total_documents": total_documents
    }


@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return FileResponse(
        path=document.file_path,
        filename=document.filename,
        media_type="application/octet-stream",
    )