from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PayloadSchemaType,
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
    Then create the payload indexes required for filtering.
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

        # Always make sure indexes exist
        create_payload_indexes()

    except Exception as e:
        print("Qdrant connection error:", e)
        raise


def create_payload_indexes():
    """
    Create indexes for user_id and document_id.
    """

    try:
        client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="user_id",
            field_schema=PayloadSchemaType.INTEGER,
        )

        print("Qdrant user_id index ready.")

    except Exception as e:
        print("user_id index:", e)

    try:
        client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="document_id",
            field_schema=PayloadSchemaType.INTEGER,
        )

        print("Qdrant document_id index ready.")

    except Exception as e:
        print("document_id index:", e)


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

    point_id = (
        int(document_id) * 1_000_000
    ) + int(chunk_id)

    point = PointStruct(
        id=point_id,
        vector=embedding,
        payload={
            "text": text,
            "document_id": int(document_id),
            "user_id": int(user_id),
            "chunk_id": int(chunk_id),
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
                    match=MatchValue(
                        value=int(document_id),
                    ),
                ),
                FieldCondition(
                    key="user_id",
                    match=MatchValue(
                        value=int(user_id),
                    ),
                ),
            ]
        ),
    )

    return True