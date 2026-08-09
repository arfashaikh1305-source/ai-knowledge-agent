from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import User
from app.documents.models import Document
from app.documents.service import (
    save_document,
    get_all_documents,
    delete_document,
)
from app.auth.security import get_current_user_id


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# =========================================================
# UPLOAD DOCUMENT
# =========================================================

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    try:
        document = save_document(
            file=file,
            db=db,
            user_id=user_id,
        )

        return {
            "message": "Document uploaded successfully",
            "id": document.id,
            "filename": document.filename,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# =========================================================
# LIST DOCUMENTS
# =========================================================

@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return get_all_documents(
        db=db,
        user_id=user_id,
    )


# =========================================================
# DOCUMENT STATS
# =========================================================

@router.get("/stats")
def document_stats(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    total_documents = (
        db.query(Document)
        .filter(Document.user_id == user_id)
        .count()
    )

    return {
        "total_documents": total_documents
    }


# =========================================================
# DOWNLOAD DOCUMENT
# =========================================================

@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
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
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return FileResponse(
        path=document.file_path,
        filename=document.filename,
        media_type="application/octet-stream",
    )


# =========================================================
# DELETE DOCUMENT
# =========================================================

@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return delete_document(
        document_id=document_id,
        db=db,
        user_id=user_id,
    )