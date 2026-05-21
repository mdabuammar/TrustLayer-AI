# TrustLayer AI Frontend

This is the React + Vite frontend for **TrustLayer AI**. It provides a sleek, dark-themed dashboard interface that allows users to upload PDF reference documents, ask questions, and visualize RAG retrieval citations along with real-time trust evaluation and hallucination scores.

## Features

- **Responsive Obsidian Dark Theme**: Glassmorphism aesthetic tailored with harmonious violet-pink neon accent gradients.
- **Drag & Drop Upload Dropzone**: Interactive upload box for reference PDF documents with progress spinner states.
- **Top_k Retrieval Slider**: Real-time context width controls.
- **Circular Trust Gauge**: Visual representation of the trust score (0-100) and risk level badge (Low/Medium/High).
- **Expandable Citations**: Interactive accordion list of retrieved source text chunks showing exact semantic match percentages.
- **Anomalies and Alerts**: Visual listing of system warning signs.

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+) installed.

### Setup Instructions

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

The application will start running and will display a local address (typically `http://localhost:5173`). Open this URL in your web browser.

---

## How It Connects to the Backend

By default, the React frontend assumes the FastAPI backend is running locally at `http://127.0.0.1:8000`.

It performs HTTP requests using **Axios** to the following endpoints:
1. **Document Upload**:
   - **Endpoint**: `POST http://127.0.0.1:8000/upload`
   - **Content-Type**: `multipart/form-data`
   - **Payload**: Form data with key `file` containing the PDF binary.
2. **Context-Constrained QA & Trust Analysis**:
   - **Endpoint**: `POST http://127.0.0.1:8000/ask`
   - **Content-Type**: `application/json`
   - **Payload**:
     ```json
     {
       "question": "User query text here",
       "top_k": 5
     }
     ```

---

## Codebase Components

The interface is built using standard React components inside `src/components/`:

- **`Header.jsx`**: Renders the application brand name and shows if a document is currently loaded in memory.
- **`UploadBox.jsx`**: Provides a drag-and-drop zone, file filter checks, and upload status messages.
- **`QuestionBox.jsx`**: Contains the query text input, top_k slider, and clickable suggested questions.
- **`AnswerCard.jsx`**: Formats the RAG generated answer, applying warning banners for refusals.
- **`TrustScoreCard.jsx`**: Animates the SVG progress circle based on the computed score and colors the risk level.
- **`WarningList.jsx`**: Flags potential hallucinations and retrieval relevance problems.
- **`CitationList.jsx`**: Lists retrieved source chunks from ChromaDB with matching scores and toggles for viewing the full chunk text.
