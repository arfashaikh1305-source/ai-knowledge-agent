from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

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
    chunk_id=None,
):
    """
    Store a single document chunk embedding in Qdrant.

    A combined document/chunk ID is used so that chunk 0
    from one document cannot overwrite chunk 0 from another.
    """

    if document_id is None:
        raise ValueError("document_id is required.")

    if chunk_id is None:
        raise ValueError("chunk_id is required.")

    expected_size = VECTOR_SIZE

    if len(embedding) != expected_size:
        raise ValueError(
            f"Invalid embedding dimension. "
            f"Expected {expected_size}, got {len(embedding)}."
        )

    # Create a unique integer ID for each document chunk.
    point_id = (int(document_id) * 1_000_000) + int(chunk_id)

    point = PointStruct(
        id=point_id,
        vector=embedding,
        payload={
            "text": text,
            "document_id": document_id,
            "chunk_id": chunk_id,
        },
    )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point],
    )

    return True