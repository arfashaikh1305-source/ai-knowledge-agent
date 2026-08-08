from google import genai

from app.config.settings import settings
from app.documents.models import Document

# Initialize Gemini Client
client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_summary(document: Document):
    """
    Generate a summary of an uploaded document using Gemini.
    """

    if not document.content:
        return "No content found in the document."

    prompt = f"""
You are an AI assistant.

Generate a clear and concise summary of the following document.

Document:

{document.content}

Summary:
"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        if hasattr(response, "text") and response.text:
            return response.text

        return "No summary generated."

    except Exception as e:
        print("Gemini Summary Error:", e)
        return f"Gemini Summary Error: {e}"