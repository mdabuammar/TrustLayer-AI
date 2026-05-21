import os
import shutil
from fastapi import UploadFile

def save_uploaded_file(upload_file: UploadFile, destination_dir: str) -> tuple[str, int]:
    """
    Saves an uploaded file safely to the destination directory.
    If a file with the same name exists, resolves collision by adding a suffix (e.g. _1, _2).
    
    Args:
        upload_file (UploadFile): FastAPI UploadFile instance.
        destination_dir (str): The folder where the file should be saved.
        
    Returns:
        tuple[str, int]: The final saved filename and the file size in bytes.
    """
    # Ensure destination directory exists
    os.makedirs(destination_dir, exist_ok=True)
    
    # Extract clean filename using os.path.basename to prevent directory traversal
    filename = os.path.basename(upload_file.filename)
    
    name, ext = os.path.splitext(filename)
    
    # Simple collision avoidance loop
    counter = 1
    new_filename = filename
    destination_path = os.path.join(destination_dir, new_filename)
    
    while os.path.exists(destination_path):
        new_filename = f"{name}_{counter}{ext}"
        destination_path = os.path.join(destination_dir, new_filename)
        counter += 1
        
    # Save the file to the resolved destination path
    # Using shutil.copyfileobj is memory efficient for larger files
    with open(destination_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    # Retrieve file size for response
    file_size_bytes = os.path.getsize(destination_path)
    
    return new_filename, file_size_bytes
