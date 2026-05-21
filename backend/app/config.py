import os
from dotenv import load_dotenv

# Get the path to the app directory and backend root directory
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)

# Load environment variables from backend/.env
env_path = os.path.join(BACKEND_DIR, ".env")
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()  # Fallback to default loading behavior

# Configure the Upload Directory
# If it's a relative path, resolve it relative to the backend directory
UPLOAD_DIR_CONFIG = os.getenv("UPLOAD_DIR", "data/uploads")
if os.path.isabs(UPLOAD_DIR_CONFIG):
    UPLOAD_DIR = UPLOAD_DIR_CONFIG
else:
    UPLOAD_DIR = os.path.abspath(os.path.join(BACKEND_DIR, UPLOAD_DIR_CONFIG))

# Ensure the upload directory exists upon configuration loading
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Server configurations
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "127.0.0.1")
