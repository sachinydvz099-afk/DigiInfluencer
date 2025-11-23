import sys
import os

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

# This entry point is specifically for Vercel
# It imports the FastAPI app from backend/main.py
