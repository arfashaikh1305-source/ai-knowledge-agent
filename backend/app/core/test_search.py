from app.core.vector_store import client, COLLECTION_NAME
from app.core.embedding_service import generate_embedding

embedding = generate_embedding("What is artificial intelligence?")

results = client.query_points(
    collection_name=COLLECTION_NAME,
    query=embedding,
    limit=5,
)

print(type(results))
print(results)