from google import genai
import traceback

from app.config.settings import settings
from app.core.search import search_documents

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def ask_ai(question: str):
    try:
        print(f"\nQuestion: {question}")

        contexts = search_documents(question)

        print(f"Retrieved {len(contexts)} document chunks.")

        if not contexts:
            return "I couldn't find any relevant information in the uploaded documents."

        context = "\n\n".join(contexts)

        prompt = f"""
You are an AI Knowledge Assistant.

Answer ONLY using the uploaded documents.

Context:
{context}

Question:
{question}

Answer:
"""

        print("Using model: gemini-flash-latest")

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        print("Gemini request completed.")

        if hasattr(response, "text") and response.text:
            return response.text

        print(response)
        return "No response generated."

    except Exception as e:
        print("\n========== FULL ERROR ==========")
        traceback.print_exc()
        print("================================\n")
        return str(e)