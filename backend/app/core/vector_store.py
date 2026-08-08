from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.config.settings import settings


COLLECTION_NAME = "documents"

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
                    size=384,
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
    """

    point_id = int(chunk_id) if chunk_id is not None else 0

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