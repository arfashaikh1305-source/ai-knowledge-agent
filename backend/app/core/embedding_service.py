_model = None


def get_model():
    global _model

    if _model is None:
        print("Loading embedding model...")

        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def generate_embedding(text: str):
    """
    Generate an embedding for the given text.
    The embedding model and sentence-transformers package
    are loaded only when an embedding is actually requested.
    """

    model = get_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()