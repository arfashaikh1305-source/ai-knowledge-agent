from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from app.config.settings import settings


COLLECTION_NAME = "documents"
VECTOR_SIZE = 768


client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)


def create_collection():
    """
    Create the Qdrant collection if it does not already exist.
    """

    try:
        collections = client.get_collections()

        collection_names = [
            collection.name
            for collection in collections.collections
        ]

        if COLLECTION_NAME not in collection_names:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=VECTOR_SIZE,
                    distance=Distance.COSINE,
                ),
            )

            print("Qdrant collection created successfully!")

        else:
            print("Qdrant collection already exists.")

    except Exception as e:
        print("Qdrant connection error:", e)
        raise


def store_embedding(
    embedding,
    text,
    document_id=None,
    user_id=None,
    chunk_id=None,
):
    """
    Store a single document chunk embedding in Qdrant.
    """

    if document_id is None:
        raise ValueError("document_id is required.")

    if user_id is None:
        raise ValueError("user_id is required.")

    if chunk_id is None:
        raise ValueError("chunk_id is required.")

    if len(embedding) != VECTOR_SIZE:
        raise ValueError(
            f"Invalid embedding dimension. "
            f"Expected {VECTOR_SIZE}, got {len(embedding)}."
        )

    point_id = (int(document_id) * 1_000_000) + int(chunk_id)

    point = PointStruct(
        id=point_id,
        vector=embedding,
        payload={
            "text": text,
            "document_id": document_id,
            "user_id": user_id,
            "chunk_id": chunk_id,
        },
    )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point],
    )

    return True


def delete_document_embeddings(
    document_id: int,
    user_id: int,
):
    """
    Delete all Qdrant chunks belonging to a specific
    document and user.
    """

    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(value=document_id),
                ),
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id),
                ),
            ]
        ),
    )

    return True