from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/questions/{interview_type}")
async def get_questions(interview_type: str):
    # Placeholder for question fetching logic
    questions = {
        "ml-engineer": ["What is the variance-bias trade-off?"],
        "backend-developer": ["Explain RESTful services."]
    }
    return {"questions": questions.get(interview_type, [])}
