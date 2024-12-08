# Voice Interview Platform

An AI-powered interview platform featuring video avatars and natural language conversation.

## Features

- Interactive AI interviewer with video avatar
- Multiple interview types (Software Engineering, Product Management, etc.)
- Real-time conversation with GPT-powered responses
- Video generation using Simli API
- HLS video streaming support

## Setup

### Prerequisites

- Node.js (for frontend)
- Python 3.10+ (for backend)
- npm or yarn
- Python virtual environment

### Environment Variables

Create a `.env` file in the backend directory with:
```
SIMLI_API_KEY="your_simli_api_key"
PLAYHT_API_KEY="your_playht_api_key"
OPENAI_API_KEY="your_openai_api_key"
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn main:app --reload --port 8001
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Usage

1. Select an interview type from the dropdown menu
2. Wait for the video avatar to load
3. Engage in conversation with the AI interviewer
4. Your responses will be evaluated in real-time

## Architecture

- Frontend: React.js with modern UI components
- Backend: FastAPI (Python) with async support
- Video: HLS.js for video streaming
- APIs: 
  - Simli AI for video generation
  - PlayHT for text-to-speech
  - OpenAI GPT for conversation

## Development

The project is structured as follows:
- `/frontend`: React application and UI components
- `/backend`: FastAPI server and API integrations
  - `main.py`: Main FastAPI application
  - `text2video.py`: Video generation logic
  - `video_player.html`: HLS video player template

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
