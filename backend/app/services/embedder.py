from sentence_transformers import SentenceTransformer

# Global cache for the embedding model
_model = None

def get_embedding_model() -> SentenceTransformer:
    """
    Retrieves the cached sentence-transformer model.
    Loads it on the CPU for efficiency.
    """
    global _model
    if _model is None:
        # Load CPU-friendly MiniLM model
        _model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    return _model

def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Generates high-quality sentence embeddings for the provided list of texts.
    
    Args:
        texts (list[str]): The text chunks to embed.
        
    Returns:
        list[list[float]]: List of embedding vectors.
    """
    if not texts:
        return []
    
    model = get_embedding_model()
    # Generate embeddings and convert the numpy arrays to list of floats
    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    return [vec.tolist() for vec in embeddings]
