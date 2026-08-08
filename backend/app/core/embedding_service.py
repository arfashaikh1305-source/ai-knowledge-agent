from sentence_transformers import SentenceTransformer

# Load the model once when the application starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    """
    Generate embeddings locally (offline).
    Returns a list of floats compatible with Qdrant.
    """

    embedding = model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )

    return embedding.tolist()