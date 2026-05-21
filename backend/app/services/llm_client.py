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
        
    preferred_model = os.getenv("OPENROUTER_MODEL", "openrouter/free")
    
    # Define a robust list of models to try, starting with user preference,
    # then falling back to known-stable active free models on OpenRouter.
    models_to_try = [preferred_model]
    fallback_pool = [
        "google/gemma-4-31b-it:free",
        "deepseek/deepseek-v4-flash:free",
        "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "openrouter/free"
    ]
    for model_id in fallback_pool:
        if model_id not in models_to_try:
            models_to_try.append(model_id)
            
    # Initialize the client pointing to OpenRouter with a timeout and minimal retries
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
        timeout=15.0,
        max_retries=1
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
    
    last_error = None
    for attempt_model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=attempt_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.0,  # Factual and deterministic
                max_tokens=1500,  # Increased to prevent reasoning truncation
                extra_headers={
                    "HTTP-Referer": "https://github.com/TrustLayerAI",
                    "X-Title": "TrustLayer AI Backend"
                }
            )
            
            choice = response.choices[0]
            message = choice.message
            answer = message.content
            
            # If the response content is empty but reasoning is present, we still need content.
            # So treat empty content as an error to proceed to the next model in the fallback chain.
            if not answer or not answer.strip():
                reasoning = getattr(message, 'reasoning', None)
                if not reasoning and hasattr(message, 'model_extra'):
                    reasoning = message.model_extra.get('reasoning')
                raise LLMAPIError(f"Model {attempt_model} returned empty content (reasoning available: {bool(reasoning)}).")
                
            return answer.strip()
            
        except Exception as e:
            last_error = e
            # Print/log the exception and try the next model
            print(f"OpenRouter model {attempt_model} call failed: {str(e)}")
            continue
            
    raise LLMAPIError(f"All attempted OpenRouter models failed. Last error: {str(last_error)}")
