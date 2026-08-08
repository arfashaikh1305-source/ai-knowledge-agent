from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    APP_ENV: str
    SECRET_KEY: str
    DATABASE_URL: str
    GEMINI_API_KEY: str
    QDRANT_HOST: str
    QDRANT_PORT: int

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
