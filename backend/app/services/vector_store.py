import os
import chromadb
from app.services.embedder import embed_texts
from app.config import BACKEND_DIR

# Establish persistent database folder inside backend/chroma_db/
CHROMA_DB_DIR = os.path.join(BACKEND_DIR, "chroma_db")

# Initialize the Persistent Client
client = chromadb.PersistentClient(path=CHROMA_DB_DIR)

# Get or create collection configured with cosine similarity
collection = client.get_or_create_collection(
    name="trustlayer_documents",
    metadata={"hnsw:space": "cosine"}
)

def store_chunks(document_id: str, filename: str, chunks: list[dict]):
    """
    Generates embeddings for chunks and saves them in ChromaDB.
    
    Args:
        document_id (str): Generated UUID for the document.
        filename (str): Original uploaded file name.
        chunks (list[dict]): List of chunk dictionaries containing 'text' and 'chunk_id'.
    """
    if not chunks:
        return
        
    texts = [chunk["text"] for chunk in chunks]
    embeddings = embed_texts(texts)
    
    ids = [f"{document_id}_chunk_{chunk['chunk_id']}" for chunk in chunks]
    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "chunk_id": str(chunk["chunk_id"])
        }
        for chunk in chunks
    ]
    
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=texts
    )

def search_similar_chunks(query: str, top_k: int = 5) -> list[dict]:
    """
    Searches for similarity chunks given a text query.
    
    Args:
        query (str): The search query.
        top_k (int): Number of top results to return.
        
    Returns:
        list[dict]: List of matching chunks with similarity scores.
    """
    # Embed the query
    query_embeddings = embed_texts([query])
    if not query_embeddings:
        return []
        
    # Query Chroma
    results = collection.query(
        query_embeddings=query_embeddings,
        n_results=top_k
    )
    
    formatted_results = []
    
    # Chroma returns lists of lists for query parameters
    if results and "ids" in results and results["ids"]:
        ids = results["ids"][0]
        distances = results["distances"][0] if "distances" in results else [0.0] * len(ids)
        metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(ids)
        documents = results["documents"][0] if "documents" in results else [""] * len(ids)
        
        for idx in range(len(ids)):
            # With cosine space, distance = 1 - cosine_similarity.
            # So similarity_score = 1 - distance. Clamped between 0 and 1.
            distance = distances[idx]
            similarity_score = max(0.0, min(1.0, round(1.0 - distance, 4)))
            
            meta = metadatas[idx]
            
            formatted_results.append({
                "chunk_id": meta.get("chunk_id", ""),
                "filename": meta.get("filename", ""),
                "text": documents[idx],
                "similarity_score": similarity_score
            })
            
    return formatted_results

def get_document_count() -> int:
    """
    Returns the total number of items stored in the collection.
    Useful to check if any documents have been uploaded.
    """
    try:
        return collection.count()
    except Exception:
        return 0

