import re

def clean_text(text: str) -> str:
    """
    Cleans the provided text by removing extra spaces and empty lines.
    
    Args:
        text (str): The input raw text.
        
    Returns:
        str: The cleaned and normalized text.
    """
    if not text:
        return ""
    
    # Normalize multiple vertical whitespaces/newlines to a single newline
    text = re.sub(r'\n+', '\n', text)
    
    # Normalize multiple spaces or tabs to a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Strip leading/trailing whitespaces from each line and join them back
    lines = [line.strip() for line in text.split('\n')]
    
    # Remove empty lines
    non_empty_lines = [line for line in lines if line]
    
    return '\n'.join(non_empty_lines)
