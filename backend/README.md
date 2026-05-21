# TrustLayer AI Backend (Phase 1)

TrustLayer AI is a lightweight, RAG-based trust and hallucination detection system designed to run locally on a normal CPU laptop.

This is the **Phase 1: Backend Foundation** which sets up the project structure, routing, config, file uploading, and clean utilities.

## Prerequisites

- **Python 3.8+** (recommended: 3.10+)
- **Windows OS** (instructions below are optimized for Windows)

---

## Setup Instructions

Follow these steps to set up and run the application locally on Windows:

### 1. Create a Virtual Environment
Open your terminal (PowerShell or Command Prompt) in the `backend` folder and run:
```bash
python -m venv venv
```

### 2. Activate the Virtual Environment
On Windows, activate the virtual environment by running:

**In PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**In Command Prompt:**
```cmd
.\venv\Scripts\activate.bat
```

Once activated, your terminal prompt will show `(venv)`.

### 3. Install Dependencies
Install all the required python packages:
```bash
pip install -r requirements.txt
```

### 4. Create the Environment File
Copy the example environment file to create your local configurations:
```bash
copy .env.example .env
```
*(By default, `.env` configures uploaded files to be saved inside `data/uploads/`)*

---

## Running the Backend

You can run the backend in one of two ways:

### Method A: Using the Windows Batch File
Double-click `run_backend.bat` or run it from the Command Prompt/PowerShell:
```cmd
.\run_backend.bat
```

### Method B: Using Uvicorn Command Directly
Run the following command from the `backend` directory:
```bash
uvicorn app.main:app --reload
```

The server will start, typically at `http://127.0.0.1:8000`.

---

## Testing the Endpoints

### 1. Root Endpoint
- **URL**: `http://127.0.0.1:8000/`
- **Method**: `GET`
- **Expected Response**:
  ```json
  {"message": "TrustLayer AI Backend is running"}
  ```

### 2. Health Endpoint
- **URL**: `http://127.0.0.1:8000/health`
- **Method**: `GET`
- **Expected Response**:
  ```json
  {
    "status": "ok",
    "service": "TrustLayer AI Backend"
  }
  ```

### 3. Swagger API Documentation (Interactive testing)
FastAPI automatically generates interactive documentation.
- Open your browser and navigate to: `http://127.0.0.1:8000/docs`
- Here you can test the endpoints:

### A. Document Upload (`POST /upload`)
Upload a PDF. The backend extracts text, cleans it, splits it into chunks, embeds them using `all-MiniLM-L6-v2`, and stores them in ChromaDB.
- **Response Format**:
  ```json
  {
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "sample.pdf",
    "total_chunks": 8,
    "message": "File uploaded, processed, and stored in vector database successfully"
  }
  ```

### B. Semantic Search (`POST /search`)
Perform similarity search across all uploaded chunks.
- **Request Body**:
  ```json
  {
    "query": "What are the core requirements?",
    "top_k": 3
  }
  ```
- **Response Format**:
  ```json
  {
    "query": "What are the core requirements?",
    "results": [
      {
        "chunk_id": "1",
        "filename": "sample.pdf",
        "text": "The core requirements are...",
        "similarity_score": 0.875
      }
    ]
  }
  ```

### C. Context-constrained QA with Trust Score (`POST /ask`)
Asks the OpenRouter LLM a question. It retrieves similar chunks, queries the LLM under strict instructions to only answer from context, and passes the output to the Trust Engine to compute a trust score and risk level.
- **Request Body**:
  ```json
  {
    "question": "What does the document say about requirements?",
    "top_k": 5
  }
  ```
- **Response Format**:
  ```json
  {
    "question": "What does the document say about requirements?",
    "answer": "The document states that the requirements are...",
    "citations": [
      {
        "chunk_id": "1",
        "filename": "sample.pdf",
        "text_preview": "The core requirements are..."
      }
    ],
    "retrieved_chunks": [
      {
        "chunk_id": "1",
        "filename": "sample.pdf",
        "text": "The core requirements are...",
        "similarity_score": 0.875
      }
    ],
    "trust_score": 85,
    "risk_level": "Low",
    "warnings": []
  }
  ```

---

## 🛡️ Trust Engine Explanation

The Trust Engine (`app/services/trust_engine.py`) determines if the LLM's answer is factually grounded in the retrieved document chunks or if there's a risk of hallucination.

### Scoring Logic:
1. **Empty Answers**: Instantly returns a score of `0` and a `High` risk level.
2. **Refusal to Answer**: If the LLM responds with *"I could not find enough evidence in the uploaded documents."* (meaning the context is insufficient), the Trust Engine sets the trust score to `50` and the risk level to `Low` (because declining to make up facts is the correct, low-risk behavior).
3. **Factual Answers**:
   - Generates vector embeddings for the answer and each retrieved chunk using the local `sentence-transformers` model.
   - Computes the **cosine similarity** between the answer and each retrieved chunk.
   - The **base trust score** is computed by mapping the maximum cosine similarity (typically in `[0, 1]`) to `[0, 100]`.
   - **Corroboration Boost**: If multiple chunks support the answer (similarity `>= 0.5`), a positive boost of up to `+10` points is added to the score.
   - **Risk Levels**:
     - `Low Risk` (Trust Score `>= 70`): Answer is backed by multiple highly-matching source passages.
     - `Medium Risk` (Trust Score `40 - 69`): Answer only partially aligns with source text.
     - `High Risk` (Trust Score `< 40`): Answer deviates significantly from source passages (high chance of hallucination).
4. **Warnings**: Lists reasons for suspicion (e.g. low semantic similarity, irrelevant retrieval matches, or lack of context).


