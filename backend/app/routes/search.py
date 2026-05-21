from fastapi import APIRouter, HTTPException, status
from app.schemas import SearchRequest, SearchResponse, ErrorResponse, SearchResultChunk
from app.services.vector_store import search_similar_chunks

router = APIRouter()

@router.post(
    "/search",
    response_model=SearchResponse,
    responses={
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def search_chunks(payload: SearchRequest):
    """
    Semantic search endpoint.
    
    - Accepts a JSON payload containing 'query' and optional 'top_k'.
    - Generates query embedding.
    - Searches ChromaDB and retrieves similar text chunks.
    - Returns query and formatted matching chunk details with cosine similarity scores.
    """
    try:
        # Perform query on ChromaDB collection
        matching_chunks = search_similar_chunks(payload.query, top_k=payload.top_k)
        
        # Map matching raw chunks to standard schema
        results = [
            SearchResultChunk(
                chunk_id=item["chunk_id"],
                filename=item["filename"],
                text=item["text"],
                similarity_score=item["similarity_score"]
            )
            for item in matching_chunks
        ]
        
        return SearchResponse(
            query=payload.query,
            results=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during semantic search: {str(e)}"
        )
