from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.documents.models import Document

from app.chat.schemas import ChatRequest, ChatResponse
from app.chat.service import ask_ai
from app.chat.summary_service import generate_summary

from app.auth.security import get_current_user_id


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user_id: int = Depends(get_current_user_id),
):
    answer = ask_ai(
        request.question,
        user_id,
    )

    return ChatResponse(
        answer=answer,
    )


@router.get("/summary/{document_id}")
def document_summary(
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

    summary = generate_summary(document)

    return {
        "document_id": document.id,
        "filename": document.filename,
        "summary": summary,
    }