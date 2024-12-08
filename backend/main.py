import openai
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from text2video import generate_video

# Set your OpenAI API key directly for testing
openai.api_key = 'sk-svcacct-KGaY88G3BLc5y9-0HYG0PdLaslTK5KdszfJLUKHFg2IM45VSj5HoHdFUjiiF8qCXPltT3BlbkFJPWJZLjASHWgyNIdXZ9G4_1J2HHWcG4OaLdpfSDvd5wh-_3LijHXHVbVV-wCFTNQwGQAA'

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class VideoRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/chat")
async def chat_with_gpt(request: ChatRequest):
    try:
        print(f"Received message: {request.message}")  # Debug log
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": request.message}],
            max_tokens=700,
            n=1,
            stop=None,
            temperature=0.5,
        )
        response_content = response.choices[0].message['content'].strip()
        print(f"API Response: {response_content}")  # Debug log
        return {"response": response_content}
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/questions/{interview_type}")
async def get_questions(interview_type: str):
    # Placeholder for question fetching logic
    questions = {
        "ml-engineer": ["What is the variance-bias trade-off?"],
        "backend-developer": ["Explain RESTful services."]
    }
    return {"questions": questions.get(interview_type, [])}

@app.post("/generate-video")
async def generate_video_endpoint(request: VideoRequest):
    print(f"Received request with text: {request.text}")
    video_info = await generate_video(request.text)
    if video_info:
        print("Video generated successfully.")
        return video_info
    else:
        print("Failed to generate video.")
        raise HTTPException(status_code=500, detail="Failed to generate video")
