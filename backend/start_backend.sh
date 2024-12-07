#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Start the FastAPI server on port 8003
uvicorn main:app --reload --port 8003
