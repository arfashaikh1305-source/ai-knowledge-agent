from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.chat.schemas import ChatRequest, ChatResponse
from app.chat.service import ask_ai
from app.auth.security import get_current_user_id

from app.database.session import get_db
from app.database.models import ChatHistory


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# =========================================================
# AI CHAT
# =========================================================

@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    result = ask_ai(
        question=request.question,
        user_id=user_id,
    )

    # Convert answer to text safely
    answer = result.get(
        "answer",
        "No answer generated.",
    )

    # Save question + answer
    history = ChatHistory(
        user_id=user_id,
        question=request.question,
        answer=answer,
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return result


# =========================================================
# GET CHAT HISTORY
# =========================================================

@router.get("/history")
def get_chat_history(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    history = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "question": item.question,
            "answer": item.answer,
            "created_at": item.created_at.isoformat(),
        }
        for item in history
    ]


# =========================================================
# DELETE CHAT HISTORY
# =========================================================

@router.delete("/history/{history_id}")
def delete_chat_history(
    history_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    history = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.id == history_id,
            ChatHistory.user_id == user_id,
        )
        .first()
    )

    if not history:
        return {
            "message": "History item not found."
        }

    db.delete(history)
    db.commit()

    return {
        "message": "History deleted successfully."
    }