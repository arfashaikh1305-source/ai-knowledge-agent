from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.config.settings import settings

client = QdrantClient(
    host=settings.QDRANT_HOST,
    port=settings.QDRANT_PORT,
)

COLLECTION_NAME = "knowledge_base"


def create_collection():
    collections = client.get_collections().collections

    names = [collection.name for collection in collections]

    if COLLECTION_NAME not in names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,  # all-MiniLM-L6-v2 embedding size
                distance=Distance.COSINE,
            ),
        )

        print("Qdrant collection created successfully!")

    else:
        print("Qdrant collection already exists.")


def store_embedding(
    document_id: int,
    chunk_id: int,
    text: str,
    embedding: list,
):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=document_id * 10000 + chunk_id,
                vector=embedding,
                payload={
                    "document_id": document_id,
                    "chunk_id": chunk_id,
                    "text": text,
                },
            )
        ],
    )

    print(f"Stored chunk {chunk_id}")