from google import genai
from google.genai import types

from app.config.settings import settings


EMBEDDING_MODEL = "gemini-embedding-2"
EMBEDDING_DIMENSION = 768

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_embedding(
    text: str,
    task_type: str = "RETRIEVAL_DOCUMENT",
):
    """
    Generate a Gemini embedding.

    RETRIEVAL_DOCUMENT is used when embedding document chunks.
    RETRIEVAL_QUERY is used when embedding user questions.
    """

    if not text or not text.strip():
        raise ValueError("Cannot generate an embedding for empty text.")

    response = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=EMBEDDING_DIMENSION,
        ),
    )

    if not response.embeddings:
        raise RuntimeError("Gemini returned no embedding.")

    embedding = response.embeddings[0].values

    if not embedding:
        raise RuntimeError("Gemini returned an empty embedding.")

    if len(embedding) != EMBEDDING_DIMENSION:
        raise RuntimeError(
            f"Expected {EMBEDDING_DIMENSION} dimensions, "
            f"got {len(embedding)}."
        )

    return list(embedding)