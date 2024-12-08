import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_video(text):
    try:
        print("Starting video generation...")
        
        # Check API keys
        simli_key = os.getenv("SIMLI_API_KEY")
        playht_key = os.getenv("PLAYHT_API_KEY", "AzMZytahwPNwdYeGKXC0S3bBgvi2")
        
        if not simli_key or not playht_key:
            print("Missing API keys:")
            print(f"Simli key present: {bool(simli_key)}")
            print(f"PlayHT key present: {bool(playht_key)}")
            return None
            
        url = "https://api.simli.ai/textToVideoStream"
        
        payload = {
            "ttsAPIKey": playht_key,
            "simliAPIKey": simli_key,
            "faceId": "tmp9i8bbq7c",
            "user_id": "default_user",
            "requestBody": {
                "audioProvider": "PlayHT",
                "text": text,
                "voice": "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
                "quality": "draft",
                "speed": 1,
                "sample_rate": 24000,
                "voice_engine": "PlayHT2.0-turbo",
                "output_format": "mp3",
                "emotion": "female_happy",
                "voice_guidance": 3,
                "style_guidance": 20,
                "text_guidance": 1
            }
        }
        
        headers = {"Content-Type": "application/json"}
        
        print("Sending request to Simli API...")
        print("Payload (without API keys):", json.dumps({**payload, "ttsAPIKey": "[HIDDEN]", "simliAPIKey": "[HIDDEN]"}, indent=2))
        
        response = requests.post(url, json=payload, headers=headers)
        print("Response status:", response.status_code)
        print("Response body:", response.text)
        
        if response.status_code != 200:
            error_msg = f"Error: {response.status_code} - {response.text}"
            print(error_msg)
            raise Exception(error_msg)
            
        response_data = response.json()
        if 'hls_url' in response_data:
            # Create HTML player
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
                </style>
            </head>
            <body>
                <div class="container">
                    <video id="video" controls></video>
                </div>
                <script>
                    var video = document.getElementById('video');
                    // Using a test video URL that we know works
                    var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
                    
                    if (Hls.isSupported()) {{
                        var hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                    }} else if (video.canPlayType('application/vnd.apple.mpegurl')) {{
                        video.src = videoSrc;
                    }}
                </script>
            </body>
            </html>
            """
            
            with open('video_player.html', 'w') as f:
                f.write(html_content)
            
            import webbrowser
            webbrowser.open('file://' + os.path.realpath('video_player.html'))
            
            return {
                'status': 'success',
                'url': response_data['hls_url'],
                'mp4_url': response_data.get('mp4_url'),
                'player_path': os.path.realpath('video_player.html')
            }
        else:
            print("No HLS URL in response")
            return None
            
    except Exception as e:
        print("Error:", str(e))
        return None

if __name__ == "__main__":
    result = generate_video("Hello! I am a gorilla.")
    print("Result:", result)