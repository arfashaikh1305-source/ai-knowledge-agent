from typing import List, Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChartData(BaseModel):
    type: str
    title: str
    labels: List[str]
    values: List[float]


class ChatResponse(BaseModel):
    answer: str
    chart: Optional[ChartData] = None