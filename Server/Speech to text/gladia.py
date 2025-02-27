import requests
import json
import os
from pathlib import Path
import time

def transcribe_audio(api_key, audio_file_path):
    """
    Transcribe audio using Gladia's speech-to-text API.
    
    Args:
        api_key (str): Your Gladia API key
        audio_file_path (str): Path to the audio file to transcribe
    
    Returns:
        dict: The transcription result
    """
    # Check if file exists
    if not Path(audio_file_path).exists():
        raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
    
    # API endpoint
    url = "https://api.gladia.io/v2/transcription"
    
    # Prepare the file for upload
    with open(audio_file_path, "rb") as audio_file:
        file_content = audio_file.read()
    
    files = {
        "audio": (
            os.path.basename(audio_file_path), 
            file_content,
            f"audio/{Path(audio_file_path).suffix[1:]}"  # Guess content type from extension
        )
    }
    
    # Add headers with API key
    headers = {
        "x-gladia-key": api_key,
    }
    
    # Optional parameters
    data = {
        "language": "auto",  # Auto-detect language
        "toggle_diarization": True,  # Enable speaker diarization if needed
    }
    
    # Set longer timeout and implement retry logic
    max_retries = 3
    retry_delay = 2  # seconds
    timeout = 120  # seconds
    
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1} of {max_retries}...")
            # Make the API request with extended timeout
            response = requests.post(url, headers=headers, files=files, data=data, timeout=timeout)
            response.raise_for_status()  # Raise exception for HTTP errors
            
            # Parse and return the result
            result = response.json()
            return result
        
        except requests.exceptions.RequestException as e:
            print(f"Error during API request (attempt {attempt + 1}): {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Response status: {e.response.status_code}")
                print(f"Response body: {e.response.text}")
            
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                print("Maximum retry attempts reached.")
                return None

def extract_text_from_result(result):
    """
    Extract just the transcribed text from the API result.
    
    Args:
        result (dict): The API response dictionary
    
    Returns:
        str: The transcribed text
    """
    if not result or "prediction" not in result:
        return "No transcription available"
    
    # If diarization is enabled, the result might include speaker information
    if "utterances" in result["prediction"]:
        text_parts = []
        for utterance in result["prediction"]["utterances"]:
            speaker = utterance.get("speaker", "Speaker")
            text = utterance.get("text", "")
            text_parts.append(f"{speaker}: {text}")
        return "\n".join(text_parts)
    
    # For simple transcription without diarization
    return result["prediction"].get("transcript", "No transcription available")

if __name__ == "__main__":
    # Replace with your actual API key
    API_KEY = "c33e9cbf-718c-4b26-b3d3-806b6d02967c"
    
    # Replace with your audio file path
    AUDIO_FILE = "audio1.wav"
    
    print(f"Starting transcription of: {AUDIO_FILE}")
    
    # Get the transcription result
    result = transcribe_audio(API_KEY, AUDIO_FILE)
    
    if result:
        # Extract and print just the text
        text = extract_text_from_result(result)
        print("\nTranscribed Text:")
        print(text)
        
        # Optionally save the full result to a JSON file
        with open("transcription_result.json", "w") as f:
            json.dump(result, f, indent=2)
        print("\nFull result saved to transcription_result.json")
    else:
        print("Transcription failed")