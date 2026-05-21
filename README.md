# TrustLayer AI

[![Backend CI](https://github.com/your-username/TrustLayerAI/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/your-username/TrustLayerAI/actions/workflows/backend-ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)](https://reactjs.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FC60A8?style=flat)](https://www.trychroma.com/)
[![SentenceTransformers](https://img.shields.io/badge/SentenceTransformers-8A2BE2?style=flat)](https://sbert.net/)

TrustLayer AI is a lightweight, CPU-friendly RAG (Retrieval-Augmented Generation) system with an explainable trust and hallucination detection layer. It evaluates whether a generated answer is factually supported by retrieved document passages.

---

## 📌 Problem Statement

LLMs are highly capable but prone to **hallucinations** (fabricating facts) and **extrapolations** (stretching truth beyond retrieved evidence). 

In enterprise environments, verifying the reliability of a RAG system's answers is critical. Typical solutions (like GPT-4-as-a-judge) are slow, expensive, and non-deterministic. **TrustLayer AI** solves this by implementing a **local, instant, explainable trust scoring loop** that compares generated answers directly against source text chunks on standard CPU hardware.

---

## ✨ Features

- **Local Verification Loop**: Evaluates answer credibility in milliseconds using a local sentence-transformer model. No GPU or cloud cost.
- **Explainable Trust Score**: Generates a score (0-100) combining semantic chunk similarity and multi-source corroboration metrics.
- **Strict Context Boundary**: System prompting enforces LLM grounding and outputs a standard refusal statement if the context is insufficient.
- **Obsidian Dark Dashboard**: High-fidelity React SPA featuring animated circular trust gauges, alerts lists, and expandable citation accordions showing match percentages.
- **Persistent Vector Store**: Uses ChromaDB persistent storage configured in cosine space.
- **Docker-ready**: Dockerfile and docker-compose configurations included for containerized deployment.

---

## ⚙️ Tech Stack

- **Backend**: Python, FastAPI, Pydantic, PyPDF
- **Embeddings**: Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Vector Database**: ChromaDB
- **LLM API**: OpenRouter (`google/gemma-3-27b-it:free`)
- **Frontend**: React + Vite, Axios, HSL CSS design system
- **DevOps**: Docker, Docker Compose, GitHub Actions (CI)

---

## 📐 System Architecture

For a detailed walkthrough, check out the [System Architecture Guide](docs/architecture.md).

```
[ User PDF Upload ] ──> [ Chunker ] ──> [ embed_texts ] ──> [ ChromaDB ]
                                                                 │
[ User Question ] ──────────────────────────────────────────> [ Retrieve Chunks ]
                                                                 │
[ LLM Generation ] <── [ Prompt Context Assembly ] <─────────────┘
      │
      v
[ Trust Engine ] ──> [ Cosine Similarity ] ──> [ Trust Score / Risk Level ] ──> [ React UI ]
```

---

## 🚀 Local Setup

### Backend Setup
1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment**:
   ```bash
   python -m venv .venv
   # Windows PowerShell:
   .venv\Scripts\Activate.ps1
   # Windows CMD:
   .venv\Scripts\activate.bat
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. **Install python packages**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Setup environment variables**:
   Create a `.env` file from `.env.example` and set your OpenRouter API key:
   ```bash
   copy .env.example .env
   ```
5. **Run the server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### Frontend Setup
1. **Navigate to frontend folder**:
   ```bash
   cd ../frontend
   ```
2. **Install node dependencies**:
   ```bash
   npm install
   ```
3. **Run the dev server**:
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:5173`.

### Running with Docker Compose
To spin up the entire backend containerized:
```bash
docker-compose up --build
```

---

## 📡 API Endpoints Summary

For complete specifications, see [API Endpoints Documentation](docs/api.md).

- `GET /health`: Health status check.
- `POST /upload`: Ingests PDF file, splits into chunks, embeds, and saves to ChromaDB.
- `POST /search`: Semantically queries document database chunks.
- `POST /ask`: Retrieval-QA pipeline with context verification, returning answer, citations, trust score, risk level, and warnings.

---

## 📊 Trust Score & Methodology

For mathematical formulations, see the [Trust Score Methodology Guide](docs/methodology.md).

- **Base Score**: Formed by the maximum cosine similarity between the answer embedding and retrieved chunk embeddings.
- **Corroboration Boost**: Up to `+10` points boost when multiple chunks support the claim.
- **Risk Tiers**:
  - `Low Risk` (Score $\ge$ 70): Answer is strongly grounded in context.
  - `Medium Risk` (Score 40-69): Gaps or potential extrapolations present.
  - `High Risk` (Score < 40): Significant divergence from context (hallucination).
- **Correct Refusal**: Score `50` / `Low Risk` (when context is lacking and the model declines to answer).

---

## 📸 Screenshots Placeholder

*(Once you run the project, add your screenshots here to enhance your GitHub repository appeal!)*

- **Dashboard Upload State**
- **QA Verification Response with High Trust Score**
- **Low Trust Hallucination Warning Alerts**

---

## 🔮 Future Work

- **Multi-Document Support**: Add filtering and cross-document references.
- **Advanced Chunking**: Implement semantic chunking based on header parsing.
- **Interactive Citations**: Click on an answer phrase to highlight the exact matching source sentence.
- **Additional Models**: Support local LLM execution via Ollama.

---

## 💼 Resume Bullet Points

Below is a ready-to-use resume bullet point describing your work on this project:

- **Built TrustLayer AI**, a local CPU-friendly RAG engine that reduces LLM hallucination risk by implementing an explainable verification loop calculating cosine similarity scores in Python, resulting in millisecond response evaluation latency on standard laptops.
- **Designed a React + Vite dashboard** integrating an SVG-based trust gauge, alerts list, and interactive source accordion visualizations, coupled with a FastAPI backend persisting embeddings in ChromaDB.
