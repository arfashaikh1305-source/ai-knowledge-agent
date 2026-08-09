from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AI Knowledge Agent"

    DATABASE_URL: str
    GEMINI_API_KEY: str

    QDRANT_URL: str
    QDRANT_API_KEY: str

    SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()