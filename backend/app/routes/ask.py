from fastapi import APIRouter, HTTPException, status
from app.schemas import AskRequest, AskResponse, Citation, SearchResultChunk, ErrorResponse
from app.services.vector_store import search_similar_chunks, get_document_count
from app.services.llm_client import generate_answer, LLMConfigurationError, LLMAPIError
from app.services.trust_engine import calculate_trust_score

router = APIRouter()

@router.post(
    "/ask",
    response_model=AskResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Configuration error or empty database"},
        502: {"model": ErrorResponse, "description": "LLM API provider error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def ask_rag(payload: AskRequest):
    """
    RAG QA endpoint with Trust Engine analysis.
    
    - Checks if documents are uploaded (returns 400 if empty).
    - Retrieves top_k similar chunks from ChromaDB.
    - Sends context to OpenRouter LLM.
    - Generates factual answer strictly bound by context.
    - Evaluates semantic similarity, risk level, and generates trust scores.
    - Returns answer, citations, chunks, trust_score, risk_level, and warnings.
    """
    # 1. Error check: Verify if any documents have been uploaded to ChromaDB
    try:
        num_items = get_document_count()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check database document count: {str(e)}"
        )
        
    if num_items == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No documents have been uploaded to the database yet. Please upload a PDF first."
        )
        
    # 2. Retrieve similar chunks
    try:
        retrieved_chunks = search_similar_chunks(payload.question, top_k=payload.top_k)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic retrieval failed: {str(e)}"
        )
        
    # 3. Generate answer using OpenRouter LLM client
    try:
        answer = generate_answer(payload.question, retrieved_chunks)
    except LLMConfigurationError as lce:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(lce)
        )
    except LLMAPIError as lae:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(lae)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during answer generation: {str(e)}"
        )
        
    # 4. Evaluate answer credibility with Trust Engine
    try:
        trust_eval = calculate_trust_score(answer, retrieved_chunks)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Trust Engine evaluation failed: {str(e)}"
        )
        
    # 5. Build citations and formatted retrieved chunks list
    citations = []
    search_results = []
    
    for chunk in retrieved_chunks:
        raw_text = chunk["text"]
        # Limit text preview to 150 characters with ellipsis if exceeded
        preview = raw_text[:150] + "..." if len(raw_text) > 150 else raw_text
        
        citations.append(
            Citation(
                chunk_id=chunk["chunk_id"],
                filename=chunk["filename"],
                text_preview=preview
            )
        )
        
        search_results.append(
            SearchResultChunk(
                chunk_id=chunk["chunk_id"],
                filename=chunk["filename"],
                text=raw_text,
                similarity_score=chunk["similarity_score"]
            )
        )
        
    return AskResponse(
        question=payload.question,
        answer=answer,
        citations=citations,
        retrieved_chunks=search_results,
        trust_score=trust_eval["trust_score"],
        risk_level=trust_eval["risk_level"],
        warnings=trust_eval["warnings"]
    )

