from app.database.base import Base
from app.database.session import engine

# Import all models
from app.database.models import User
from app.documents.models import Document

Base.metadata.create_all(bind=engine)

print("Database initialized successfully!")