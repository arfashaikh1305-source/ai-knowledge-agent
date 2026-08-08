from google import genai
from app.config.settings import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

print("Available Gemini Models:\n")

for model in client.models.list():
    print(model.name)