import pypdf

class PDFExtractionError(ValueError):
    """Exception raised when PDF text extraction fails due to formatting, corruption, or lack of content."""
    pass

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts raw text from a PDF file located at file_path using pypdf.
    
    Args:
        file_path (str): The local system path to the PDF file.
        
    Returns:
        str: Extracted raw text.
        
    Raises:
        PDFExtractionError: If the PDF is empty, corrupted, unreadable, or contains no extractable text.
    """
    try:
        reader = pypdf.PdfReader(file_path)
    except Exception as e:
        raise PDFExtractionError(f"Unreadable or corrupted PDF file: {str(e)}")
        
    # Check if PDF contains pages
    if not reader.pages or len(reader.pages) == 0:
        raise PDFExtractionError("The PDF file contains no pages.")
        
    extracted_text = []
    for page_num, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        except Exception:
            # We log or ignore individual page failure, but if all fail, we will raise an error
            pass
            
    full_text = "".join(extracted_text)
    
    # Check if we successfully extracted any printable/meaningful text
    if not full_text or not full_text.strip():
        raise PDFExtractionError(
            "The PDF file contains no extractable text. It may be a scanned image or completely empty."
        )
        
    return full_text

