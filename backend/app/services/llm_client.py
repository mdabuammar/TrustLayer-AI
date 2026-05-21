import os
from openai import OpenAI

class LLMConfigurationError(ValueError):
    """Raised when LLM environment variables are missing or incorrect."""
    pass

class LLMAPIError(RuntimeError):
    """Raised when the LLM API endpoint returns an error."""
    pass

def generate_answer(question: str, context_chunks: list[dict]) -> str:
    """
    Sends retrieved document chunks and a user question to OpenRouter to generate an answer.
    
    Args:
        question (str): The query question.
        context_chunks (list[dict]): List of retrieved context chunks.
        
    Returns:
        str: LLM response.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise LLMConfigurationError(
            "OPENROUTER_API_KEY is not configured or is set to placeholder. "
            "Please configure a valid API key in your .env file."
        )
        
    model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
    
    # Initialize the client pointing to OpenRouter
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    
    # If there is no context, return the required placeholder response directly
    if not context_chunks:
        return "I could not find enough evidence in the uploaded documents."
        
    # Construct context formatted string
    context_blocks = []
    for idx, chunk in enumerate(context_chunks):
        filename = chunk.get("filename", "unknown")
        chunk_id = chunk.get("chunk_id", "unknown")
        text = chunk.get("text", "")
        context_blocks.append(
            f"[Source: {filename} | Chunk ID: {chunk_id}]\n{text}"
        )
    context_text = "\n\n".join(context_blocks)
    
    # Strict prompt instructions as required
    system_prompt = (
        "You are TrustLayer AI, a rigorous RAG assistant.\n"
        "Your task is to answer the user's question using ONLY the provided context blocks below.\n"
        "Strict Constraints:\n"
        "- Base your answer strictly on facts directly mentioned in the context.\n"
        "- Do not extrapolate, assume, or use any outside knowledge.\n"
        "- If the provided context does not contain enough information to answer the question, "
        "you MUST reply with exactly: 'I could not find enough evidence in the uploaded documents.'\n"
        "Keep your answer clear, direct, and factual."
    )
    
    user_prompt = f"Context:\n{context_text}\n\nQuestion: {question}"
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.0,  # Factual and deterministic
            max_tokens=500,
            # Extra headers for OpenRouter rankings/logging if needed
            extra_headers={
                "HTTP-Referer": "https://github.com/TrustLayerAI",
                "X-Title": "TrustLayer AI Backend"
            }
        )
        
        answer = response.choices[0].message.content
        if not answer:
            raise LLMAPIError("Received an empty response from OpenRouter.")
            
        return answer.strip()
        
    except Exception as e:
        raise LLMAPIError(f"OpenRouter API call failed: {str(e)}")
