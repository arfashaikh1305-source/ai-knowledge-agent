from qdrant_client.models import FieldCondition, Filter, MatchValue

from app.core.vector_store import client, COLLECTION_NAME
from app.core.embedding_service import generate_embedding


def search_documents(
    query: str,
    user_id: int,
    limit: int = 5,
):
    """
    Generate an embedding for the user's question
    and search only the logged-in user's document chunks.
    """

    embedding = generate_embedding(
        query,
        task_type="RETRIEVAL_QUERY",
    )

    try:
        user_filter = Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id),
                )
            ]
        )

        results = client.query_points(
            collection_name=COLLECTION_NAME,
            query=embedding,
            query_filter=user_filter,
            limit=limit,
        )

        print("=" * 60)
        print("QDRANT RESULTS")
        print(results)
        print("=" * 60)

        contexts = []

        if hasattr(results, "points"):
            for point in results.points:
                payload = getattr(point, "payload", {})

                if payload and "text" in payload:
                    contexts.append(payload["text"])

        return contexts

    except Exception as e:
        print("=" * 60)
        print("QDRANT SEARCH ERROR")
        print(e)
        print("=" * 60)
        raise