def split_text_into_chunks(text: str, chunk_size: int = 700, overlap: int = 150) -> list[dict]:
    """
    Splits text into chunks of specified maximum character size with overlap.
    Aims to split at word boundaries (spaces) near the chunk end to avoid breaking words.
    
    Args:
        text (str): The cleaned text to split.
        chunk_size (int): Max character length of each chunk.
        overlap (int): Number of characters to overlap between successive chunks.
        
    Returns:
        list[dict]: A list of chunk dictionaries containing chunk_id, text, and char_count.
    """
    if not text:
        return []
        
    # Prevent infinite loops if overlap is invalid
    if overlap >= chunk_size:
        overlap = chunk_size - 1 if chunk_size > 1 else 0
        
    chunks = []
    text_length = len(text)
    start = 0
    chunk_id = 1
    
    while start < text_length:
        # Determine initial end index
        end = min(start + chunk_size, text_length)
        
        # If we are not at the end of the text, try to find a natural word boundary
        # in the last part of the chunk to avoid splitting a word in half.
        if end < text_length:
            # Look back up to 30 characters for a space boundary
            lookback_limit = max(start, end - 30)
            boundary = text.rfind(' ', lookback_limit, end)
            if boundary != -1:
                end = boundary + 1  # Splitting after the space
                
        chunk_text = text[start:end].strip()
        
        if chunk_text:
            chunks.append({
                "chunk_id": chunk_id,
                "text": chunk_text,
                "char_count": len(chunk_text)
            })
            chunk_id += 1
            
        if end >= text_length:
            break
            
        # Determine the next start index based on overlap
        next_start = end - overlap
        
        # Guard: Ensure we always advance at least 1 character to avoid infinite loop
        if next_start <= start:
            next_start = end
            
        start = next_start
        
    return chunks
