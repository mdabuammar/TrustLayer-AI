import math
from app.services.embedder import embed_texts

def calculate_cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """
    Computes the cosine similarity between two numeric vectors.
    """
    dot_product = sum(x * y for x, y in zip(v1, v2))
    mag1 = math.sqrt(sum(x * x for x in v1))
    mag2 = math.sqrt(sum(x * x for x in v2))
    
    if mag1 == 0.0 or mag2 == 0.0:
        return 0.0
        
    return dot_product / (mag1 * mag2)

def get_similarity_scores(answer: str, chunk_texts: list[str]) -> list[float]:
    """
    Generates similarity scores between the generated answer and each chunk text.
    
    Args:
        answer (str): The model's answer.
        chunk_texts (list[str]): Retrieved source texts.
        
    Returns:
        list[float]: Cost similarity score per chunk.
    """
    if not answer or not chunk_texts:
        return []
        
    # Batch embed the answer and all chunks
    all_texts = [answer] + chunk_texts
    embeddings = embed_texts(all_texts)
    
    answer_vector = embeddings[0]
    chunk_vectors = embeddings[1:]
    
    scores = []
    for chunk_vector in chunk_vectors:
        score = calculate_cosine_similarity(answer_vector, chunk_vector)
        scores.append(round(score, 4))
        
    return scores
