from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.schemas import UserRegister, UserLogin
from app.auth.service import register_user, login_user
from app.database.session import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    try:
        new_user = register_user(user, db)

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "email": new_user.email,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        return login_user(
            user.email,
            user.password,
            db,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )