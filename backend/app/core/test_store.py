from app.core.embedding_service import generate_embedding
from app.core.vector_store import create_collection, store_embedding

create_collection()

text = "Artificial Intelligence is changing healthcare."

embedding = generate_embedding(text)

store_embedding(
    document_id=1,
    chunk_id=1,
    text=text,
    embedding=embedding,
)

print("Embedding stored successfully!")