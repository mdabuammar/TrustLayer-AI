from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    """Schema for health check response."""
    status: str = Field(..., example="ok")
    service: str = Field(..., example="TrustLayer AI Backend")

class UploadResponse(BaseModel):
    """Schema for successful document upload, chunking, and embedding storage response."""
    document_id: str = Field(..., example="550e8400-e29b-41d4-a716-446655440000")
    filename: str = Field(..., example="sample.pdf")
    total_chunks: int = Field(..., example=8)
    message: str = Field(..., example="File uploaded, processed, and stored in vector database successfully")

class SearchRequest(BaseModel):
    """Schema for similar chunk search requests."""
    query: str = Field(..., min_length=1, example="What is TrustLayer AI?")
    top_k: int = Field(default=5, ge=1, le=50, example=5)

class SearchResultChunk(BaseModel):
    """Schema for a single chunk match in search results."""
    chunk_id: str = Field(..., example="1")
    filename: str = Field(..., example="sample.pdf")
    text: str = Field(..., example="TrustLayer AI is a CPU-friendly hallucination detection system.")
    similarity_score: float = Field(..., example=0.875)

class SearchResponse(BaseModel):
    """Schema for search results response."""
    query: str = Field(..., example="What is TrustLayer AI?")
    results: list[SearchResultChunk] = Field(...)

class AskRequest(BaseModel):
    """Schema for question answering requests."""
    question: str = Field(..., min_length=1, example="What is the main topic of the uploaded document?")
    top_k: int = Field(default=5, ge=1, le=50, example=5)

class Citation(BaseModel):
    """Schema for document citations supporting the generated answer."""
    chunk_id: str = Field(..., example="1")
    filename: str = Field(..., example="sample.pdf")
    text_preview: str = Field(..., example="TrustLayer AI is a CPU-friendly...")

class AskResponse(BaseModel):
    """Schema for the RAG generated answer and trust evaluation response."""
    question: str = Field(..., example="What is the main topic?")
    answer: str = Field(..., example="The document describes TrustLayer AI...")
    citations: list[Citation] = Field(...)
    retrieved_chunks: list[SearchResultChunk] = Field(...)
    trust_score: int = Field(..., example=85)
    risk_level: str = Field(..., example="Low")
    warnings: list[str] = Field(..., example=["Retrieval relevance is low"])


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str = Field(..., example="Invalid file format. Only PDF files are allowed.")


