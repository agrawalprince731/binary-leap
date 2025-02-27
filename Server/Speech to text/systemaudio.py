import pyaudio
import wave
import time

# Initialize PyAudio
audio = pyaudio.PyAudio()

# Find a WASAPI loopback device (Windows specific)
def find_wasapi_loopback(p):
    """Find a WASAPI loopback device on Windows."""
    wasapi_devices = []
    
    # List all available devices and their properties
    for i in range(p.get_device_count()):
        dev_info = p.get_device_info_by_index(i)
        dev_name = dev_info["name"].lower()
        
        # Check for hostapi type (2 is typically WASAPI on Windows)
        if dev_info["hostApi"] == 2 and dev_info["maxInputChannels"] > 0:
            print(f"Potential device: {dev_info['name']} (Index: {i})")
            wasapi_devices.append((i, dev_info["name"]))
            # Check common patterns for loopback devices
            if any(term in dev_name for term in ["loopback", "what u hear", "stereo mix", "output"]):
                print(f"Found likely loopback device: {dev_info['name']} (Index: {i})")
                return i, dev_info
    
    # If we found any WASAPI devices, return the first one (as a fallback)
    if wasapi_devices:
        dev_index = wasapi_devices[0][0]
        dev_info = p.get_device_info_by_index(dev_index)
        print(f"No explicit loopback device found. Using: {wasapi_devices[0][1]} (Index: {dev_index})")
        return dev_index, dev_info
    
    # Print out all devices to help with debugging
    print("\nAll available audio devices:")
    for i in range(p.get_device_count()):
        dev_info = p.get_device_info_by_index(i)
        print(f"Index {i}: {dev_info['name']} (Input channels: {dev_info['maxInputChannels']}, Host API: {dev_info['hostApi']})")
        
    raise Exception("No suitable recording device found. Make sure 'Stereo Mix' is enabled in Windows sound settings.")

try:
    # Configuration
    CHUNK = 1024  # Buffer size
    RECORD_SECONDS = 10  # Duration of recording
    OUTPUT_FILENAME = "system_audio.wav"
    
    # Get the loopback device index and info
    loopback_index, device_info = find_wasapi_loopback(audio)
    
    # Use the device's default sample rate
    RATE = int(device_info['defaultSampleRate'])
    CHANNELS = min(2, int(device_info['maxInputChannels']))  # Use stereo if available, mono otherwise
    FORMAT = pyaudio.paInt16  # Audio format
    
    print(f"Using device: {device_info['name']}")
    print(f"Sample Rate: {RATE}")
    print(f"Channels: {CHANNELS}")
    
    # Open the stream with the device's supported settings
    stream = audio.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        input_device_index=loopback_index,
        frames_per_buffer=CHUNK
    )
    
    print(f"Recording system audio for {RECORD_SECONDS} seconds...")
    frames = []
    
    # Record audio in chunks
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        frames.append(data)
        # Print progress every second
        if i % (RATE // CHUNK) == 0:
            seconds_elapsed = i // (RATE // CHUNK)
            print(f"Recording: {seconds_elapsed}/{RECORD_SECONDS} seconds")
    
    print("Recording finished.")
    
    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    
    # Save the recorded data as a WAV file
    with wave.open(OUTPUT_FILENAME, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
    
    print(f"System audio saved as {OUTPUT_FILENAME}")

except Exception as e:
    print(f"Error: {str(e)}")
    
finally:
    # Make sure resources are always released
    audio.terminate()