# API Endpoints Documentation

All backend API endpoints run on the default port `8000` (e.g. `http://127.0.0.1:8000`).

---

## 1. Health Check
Checks if the backend API service is up and running.

- **URL**: `/health`
- **Method**: `GET`
- **Response Headers**: `Content-Type: application/json`
- **Response Example (200 OK)**:
  ```json
  {
    "status": "ok",
    "service": "TrustLayer AI Backend"
  }
  ```

---

## 2. Document Upload (`POST /upload`)
Uploads a reference PDF. The system extracts, cleans, chunks (size 700, overlap 150), generates embeddings, and saves them to a persistent ChromaDB database.

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: PDF binary file.
- **Response Example (200 OK)**:
  ```json
  {
    "document_id": "904b7be8-0e31-409f-b98a-f5bbde1a243a",
    "filename": "quarterly_report.pdf",
    "total_chunks": 12,
    "message": "File uploaded, processed, and stored in vector database successfully"
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: Missing file, invalid file extension (non-PDF), unreadable/empty PDF.
    ```json
    { "detail": "Empty PDF file or no readable text extracted." }
    ```

---

## 3. Semantic Search (`POST /search`)
Queries ChromaDB to retrieve similar document chunks. Helpful for debugging retrieval results.

- **URL**: `/search`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "query": "What are the growth targets?",
    "top_k": 3
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "query": "What are the growth targets?",
    "results": [
      {
        "chunk_id": "3",
        "filename": "quarterly_report.pdf",
        "text": "Our primary quarterly growth target is 15% quarter-over-quarter...",
        "similarity_score": 0.8124
      }
    ]
  }
  ```

---

## 4. Ask & Verify (`POST /ask`)
Executes RAG context retrieval, invokes the OpenRouter LLM under strict fact constraints, and runs the Trust Engine loop to analyze hallucination risk.

- **URL**: `/ask`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "question": "What is the expected growth for this quarter?",
    "top_k": 5
  }
  ```
- **Response Example (200 OK)**:
  ```json
  {
    "question": "What is the expected growth for this quarter?",
    "answer": "The expected growth for this quarter is 15% quarter-over-quarter.",
    "citations": [
      {
        "chunk_id": "3",
        "filename": "quarterly_report.pdf",
        "text_preview": "Our primary quarterly growth target is 15%..."
      }
    ],
    "retrieved_chunks": [
      {
        "chunk_id": "3",
        "filename": "quarterly_report.pdf",
        "text": "Our primary quarterly growth target is 15% quarter-over-quarter...",
        "similarity_score": 0.8124
      }
    ],
    "trust_score": 92,
    "risk_level": "Low",
    "warnings": []
  }
  ```
- **Response Example for Insufficient Evidence (200 OK)**:
  ```json
  {
    "question": "What is their revenue in Europe?",
    "answer": "I could not find enough evidence in the uploaded documents.",
    "citations": [
      {
        "chunk_id": "1",
        "filename": "quarterly_report.pdf",
        "text_preview": "Quarterly overview of operations in the Americas..."
      }
    ],
    "retrieved_chunks": [
      {
        "chunk_id": "1",
        "filename": "quarterly_report.pdf",
        "text": "Quarterly overview of operations in the Americas...",
        "similarity_score": 0.3541
      }
    ],
    "trust_score": 50,
    "risk_level": "Low",
    "warnings": []
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: No documents uploaded yet in ChromaDB database.
    ```json
    { "detail": "No documents have been uploaded to the database yet. Please upload a PDF first." }
    ```
  - **502 Bad Gateway**: OpenRouter API provider connection timeout or token quota limit error.
    ```json
    { "detail": "OpenRouter API call failed: API connection error." }
    ```
