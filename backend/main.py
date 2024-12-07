import openai
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Set your OpenAI API key directly for testing
openai.api_key = 'sk-svcacct-KGaY88G3BLc5y9-0HYG0PdLaslTK5KdszfJLUKHFg2IM45VSj5HoHdFUjiiF8qCXPltT3BlbkFJPWJZLjASHWgyNIdXZ9G4_1J2HHWcG4OaLdpfSDvd5wh-_3LijHXHVbVV-wCFTNQwGQAA'

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_with_gpt(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": request.message}],
            max_tokens=420,
            n=1,
            stop=None,
            temperature=0.5,
        )
        return {"response": response.choices[0].message['content'].strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/questions/{interview_type}")
async def get_questions(interview_type: str):
    # Placeholder for question fetching logic
    questions = {
        "ml-engineer": ["What is the variance-bias trade-off?"],
        "backend-developer": ["Explain RESTful services."]
    }
    return {"questions": questions.get(interview_type, [])}
