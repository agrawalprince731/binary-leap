import speech_recognition as sr
import os
import argparse
from pydub import AudioSegment
from pydub.silence import split_on_silence

def convert_large_audio(path, min_silence_len=500, silence_thresh=-40):
    """
    Split larger audio files and convert them piece by piece
    
    Args:
        path: Path to the audio file
        min_silence_len: Minimum length of silence (in ms) to use for splitting
        silence_thresh: Silence threshold in dB
        
    Returns:
        The full transcribed text
    """
    # Load the audio file with pydub
    sound = AudioSegment.from_file(path)
    
    # Split audio where silence is detected
    chunks = split_on_silence(
        sound,
        min_silence_len=min_silence_len,
        silence_thresh=silence_thresh
    )
    
    # Create a directory to store the temporary audio chunks
    if not os.path.isdir("temp_chunks"):
        os.mkdir("temp_chunks")
        
    full_text = ""
    
    # Process each chunk of audio
    for i, chunk in enumerate(chunks):
        # Export chunk as temporary file
        chunk_filename = os.path.join("temp_chunks", f"chunk{i}.wav")
        chunk.export(chunk_filename, format="wav")
        
        # Transcribe the chunk
        chunk_text = convert_audio_to_text(chunk_filename)
        full_text += chunk_text + " "
        
        # Remove the temporary file
        os.remove(chunk_filename)
        
    # Remove the temporary directory
    if os.path.isdir("temp_chunks"):
        os.rmdir("temp_chunks")
        
    return full_text.strip()

def convert_audio_to_text(path):
    """
    Convert audio file to text
    
    Args:
        path: Path to the audio file
        
    Returns:
        Transcribed text or error message
    """
    recognizer = sr.Recognizer()
    
    # Load the audio file
    with sr.AudioFile(path) as source:
        # Read the audio data
        audio_data = recognizer.record(source)
        
        # Try to recognize the speech
        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "[Speech not recognized]"
        except sr.RequestError as e:
            return f"[Error with the API: {e}]"

def main():
    parser = argparse.ArgumentParser(description="Convert audio files to text")
    parser.add_argument("audio_path", help="Path to the audio file")
    parser.add_argument("--output", "-o", help="Path to output text file (optional)")
    parser.add_argument("--large", "-l", action="store_true", help="Process as large file (split on silence)")
    
    args = parser.parse_args()
    
    # Check if file exists
    if not os.path.exists(args.audio_path):
        print(f"Error: File '{args.audio_path}' does not exist")
        return
    
    print(f"Converting {args.audio_path} to text...")
    
    # Convert audio to text
    if args.large:
        text = convert_large_audio(args.audio_path)
    else:
        text = convert_audio_to_text(args.audio_path)
    
    # Print the result
    print("\nTranscription:")
    print(text)
    
    # Save to file if requested
    if args.output:
        with open(args.output, "w") as f:
            f.write(text)
        print(f"\nTranscription saved to {args.output}")

if __name__ == "__main__":
    main()