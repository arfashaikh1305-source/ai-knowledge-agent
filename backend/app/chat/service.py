from google import genai
import traceback
import json

from app.config.settings import settings
from app.core.search import search_documents


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# =========================================================
# AI CHAT
# =========================================================

def ask_ai(
    question: str,
    user_id: int,
):
    try:
        print(f"\nQuestion: {question}")

        # -------------------------------------------------
        # SEARCH USER DOCUMENTS
        # -------------------------------------------------

        contexts = search_documents(
            question,
            user_id,
        )

        print(
            f"Retrieved {len(contexts)} document chunks."
        )

        if not contexts:
            return {
                "answer": (
                    "I couldn't find any relevant information "
                    "in your uploaded documents."
                ),
                "chart": None,
            }

        # -------------------------------------------------
        # BUILD CONTEXT
        # -------------------------------------------------

        context = "\n\n".join(contexts)

        # -------------------------------------------------
        # PROMPT
        # -------------------------------------------------

        prompt = f"""
You are an AI Knowledge Assistant.

Answer ONLY using the uploaded documents belonging
to the current user.

Do not invent facts or numbers.

You must return ONLY valid JSON.

Use this exact structure:

{{
  "answer": "Your normal text answer here",
  "chart": null
}}

OR, when the answer contains useful numerical or
categorical data that can be represented as a chart:

{{
  "answer": "Your explanation of the data",
  "chart": {{
    "type": "bar",
    "title": "Chart title",
    "labels": ["A", "B", "C"],
    "values": [10, 20, 30]
  }}
}}

Rules:

- Use "bar" for category comparisons.
- Use "line" for changes over time.
- Use "pie" for part-to-whole proportions.
- Only create a chart when the uploaded documents
  contain enough data to support it.
- Never invent chart values.
- labels and values must have the same number of items.
- values must contain numbers.
- If a chart is not useful, return "chart": null.
- Keep the answer concise.

Context:
{context}

Question:
{question}

Return ONLY JSON.
"""

        # -------------------------------------------------
        # GEMINI REQUEST
        # -------------------------------------------------

        print("Using model: gemini-3.5-flash")

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        print("Gemini request completed.")

        # -------------------------------------------------
        # CHECK RESPONSE
        # -------------------------------------------------

        if not hasattr(response, "text") or not response.text:
            return {
                "answer": "No response generated.",
                "chart": None,
            }

        raw_response = response.text.strip()

        print("Gemini raw response:")
        print(raw_response)

        # -------------------------------------------------
        # REMOVE MARKDOWN CODE FENCES
        # -------------------------------------------------

        if raw_response.startswith("```"):
            raw_response = raw_response.replace(
                "```json",
                "",
                1,
            )

            raw_response = raw_response.replace(
                "```",
                "",
            ).strip()

        # -------------------------------------------------
        # PARSE JSON
        # -------------------------------------------------

        try:
            result = json.loads(raw_response)

        except json.JSONDecodeError:
            print("Gemini did not return valid JSON.")

            return {
                "answer": raw_response,
                "chart": None,
            }

        # -------------------------------------------------
        # GET ANSWER
        # -------------------------------------------------

        answer = result.get(
            "answer",
            "No answer generated.",
        )

        chart = result.get("chart")

        # -------------------------------------------------
        # VALIDATE CHART
        # -------------------------------------------------

        if chart:
            chart_type = chart.get("type")
            title = chart.get("title")
            labels = chart.get("labels")
            values = chart.get("values")

            if (
                chart_type not in ["bar", "line", "pie"]
                or not title
                or not isinstance(labels, list)
                or not isinstance(values, list)
                or len(labels) != len(values)
            ):
                print("Invalid chart returned by Gemini.")

                chart = None

        # -------------------------------------------------
        # RETURN RESULT
        # -------------------------------------------------

        return {
            "answer": answer,
            "chart": chart,
        }

    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:
        error_message = str(e)

        print("\n========== FULL ERROR ==========")
        traceback.print_exc()
        print("================================\n")

        # -------------------------------------------------
        # QUOTA / RATE LIMIT
        # -------------------------------------------------

        if (
            "RESOURCE_EXHAUSTED" in error_message
            or "429" in error_message
        ):
            return {
                "answer": (
                    "The AI service has reached its current "
                    "usage limit. Please try again later."
                ),
                "chart": None,
            }

        # -------------------------------------------------
        # MODEL NOT FOUND / UNAVAILABLE
        # -------------------------------------------------

        if (
            "NOT_FOUND" in error_message
            or "404" in error_message
        ):
            return {
                "answer": (
                    "The selected AI model is currently "
                    "unavailable. Please try again later."
                ),
                "chart": None,
            }

        # -------------------------------------------------
        # OTHER ERRORS
        # -------------------------------------------------

        return {
            "answer": (
                "Sorry, I couldn't generate an answer right now. "
                "Please try again."
            ),
            "chart": None,
        }