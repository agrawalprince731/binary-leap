
    
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