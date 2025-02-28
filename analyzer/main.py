from fastapi import FastAPI
from format_transcript import format_transcript
from experience_analyzer import analyze_experience
from sentiment_analyzer import analyze_sentiment


app = FastAPI()

@app.get("/analysis")
async def analysis(transcript:str,job_description:str):
    formatted_transcript = format_transcript(transcript)
    print(formatted_transcript)

    experience_analysis = analyze_experience(formatted_transcript,job_description)

    sentimental_analysis = analyze_sentiment(transcript)

    return {
        "experience_analysis": experience_analysis,
        "sentimental_analysis": sentimental_analysis
    }


