from app.core.embedding_service import generate_embedding

embedding = generate_embedding(
    "Artificial Intelligence is changing the world."
)

print("Embedding Dimension:", len(embedding))
print(embedding[:10])