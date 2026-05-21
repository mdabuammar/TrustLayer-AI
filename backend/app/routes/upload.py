import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.config import UPLOAD_DIR
from app.services.file_storage import save_uploaded_file
from app.services.document_processor import extract_text_from_pdf, PDFExtractionError
from app.services.chunker import split_text_into_chunks
from app.services.vector_store import store_chunks
from app.utils.text_cleaner import clean_text
from app.schemas import UploadResponse, ErrorResponse

router = APIRouter()

@router.post(
    "/upload",
    response_model=UploadResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file type or unprocessable PDF"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Endpoint to upload and process a PDF document.
    
    - Accepts PDF files only.
    - Saves the file safely in the backend/data/uploads/ directory.
    - Resolves collisions if a file with the same name already exists.
    - Extracts text from the PDF.
    - Cleans the text (removes extra spaces and empty lines).
    - Splits the text into chunks.
    - Stores chunks and their embeddings in ChromaDB.
    - Returns document_id, filename, total_chunks, and success message.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing."
        )
        
    # Validate file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file extension. Only PDF files are allowed."
        )
        
    try:
        # 1. Save the file to storage
        saved_filename, file_size = save_uploaded_file(file, UPLOAD_DIR)
        saved_file_path = os.path.join(UPLOAD_DIR, saved_filename)
        
        # 2. Extract text from PDF
        try:
            raw_text = extract_text_from_pdf(saved_file_path)
        except PDFExtractionError as pe:
            # Clean up the file if it was saved but cannot be processed
            if os.path.exists(saved_file_path):
                os.remove(saved_file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(pe)
            )
            
        # 3. Clean the text
        cleaned_text = clean_text(raw_text)
        
        # 4. Chunk the text
        chunks = split_text_into_chunks(cleaned_text)
        
        # 5. Generate a unique document_id and store chunks/embeddings in ChromaDB
        document_id = str(uuid.uuid4())
        try:
            store_chunks(document_id, saved_filename, chunks)
        except Exception as ve:
            # Clean up the file if we failed to write to DB
            if os.path.exists(saved_file_path):
                os.remove(saved_file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to store document in vector database: {str(ve)}"
            )
        
        return UploadResponse(
            document_id=document_id,
            filename=saved_filename,
            total_chunks=len(chunks),
            message="File uploaded, processed, and stored in vector database successfully"
        )
        
    except HTTPException:
        # Re-raise HTTPExceptions (e.g. from PDFExtractionError handling)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file: {str(e)}"
        )


