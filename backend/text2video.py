import aiohttp
from dotenv import load_dotenv
import os
import json
from urllib.parse import urljoin
from simli import SimliClient, SimliConfig

# Load environment variables from .env file
load_dotenv()

async def generate_video(text):
    connection = SimliClient(
        SimliConfig(
            apiKey=os.getenv("SIMLI_API_KEY"),
            faceId="tmp9i8bbq7c",
            maxSessionLength=20,
            maxIdleTime=10,
        )
    )
    await connection.Initialize()
    
    payload = {
        "ttsAPIKey": os.getenv("ELEVENLABS_API_KEY"),
        "audioProvider": "ElevenLabs",
        "text": text,
        "voiceName": "pMsXgVXv3BLzUgSXRplE",
        "model_id": "eleven_turbo_v2",
        "voice_settings": {
            "stability": 0.1,
            "similarity_boost": 0.3,
            "style": 0.2
        }
    }
    headers = {"Content-Type": "application/json"}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post("https://api.simli.ai/textToVideoStream", json=payload, headers=headers) as response:
                response.raise_for_status()  # Raise an exception for bad status codes
                
                response_data = await response.json()
                print("Simli API Response:", response_data)  # Debug print
                
                if 'hls_url' in response_data:
                    return {'url': response_data['hls_url'], 'type': 'hls'}
                else:
                    raise Exception("No HLS URL in response")
                    
    except Exception as e:
        print(f"Error generating video: {str(e)}")
        return None

# Example usage
text = """HELLO 123 123 123 123"""

async def main():
    hls_url = await generate_video(text)
    if hls_url:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Video Player</title>
            <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
            <style>
                .container {{
                    max-width: 800px;
                    margin: 20px auto;
                    text-align: center;
                }}
                video {{
                    width: 100%;
                    margin: 20px 0;
                }}
                #playButton {{
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }}
                #playButton:hover {{
                    background-color: #45a049;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <button id="playButton">Click to Play Video</button>
                <video id="video" controls playsinline></video>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {{
                    var video = document.getElementById('video');
                    var playButton = document.getElementById('playButton');
                    var videoSrc = '{hls_url['url']}';
                    var hls;
                    
                    if (Hls.isSupported()) {{
                        hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                    }} else if (video.canPlayType('application/vnd.apple.mpegurl')) {{
                        video.src = videoSrc;
                    }}

                    playButton.addEventListener('click', function() {{
                        video.play()
                            .then(() => {{
                                console.log('Playback started');
                                playButton.style.display = 'none';
                            }})
                            .catch(e => console.error('Playback failed:', e));
                    }});
                }});
            </script>
        </body>
        </html>
        """
        
        # Save and open the HTML file
        with open('video_player.html', 'w') as f:
            f.write(html_content)
        
        # Open in default browser using file:// protocol for local files
        import webbrowser
        webbrowser.open('file://' + os.path.realpath('video_player.html'))

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())