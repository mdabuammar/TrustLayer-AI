@echo off
echo Starting TrustLayer AI Backend...
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause
