import re
import json
import language_tool_python
from textblob import TextBlob
from typing import Dict, List
from collections import Counter

# Initialize LanguageTool for grammar checking
grammar_tool = language_tool_python.LanguageTool('en-US')

# Common filler words to track
FILLER_WORDS = {"uh", "um", "like", "you know", "actually", "basically", "literally", "so", "right"}

def count_filler_words(text: str) -> Dict[str, int]:
    """
    Count occurrences of filler words in the text.

    :param text: The transcript to analyze.
    :return: Dictionary with filler word counts.
    """
    word_list = text.lower().split()
    filler_count = {word: word_list.count(word) for word in FILLER_WORDS if word in word_list}
    return filler_count

def get_polarity_score(text: str) -> float:
    """
    Get the sentiment polarity score (-1 = Negative, 0 = Neutral, 1 = Positive).

    :param text: The transcript to analyze.
    :return: Polarity score.
    """
    return TextBlob(text).sentiment.polarity

def detect_grammar_mistakes(text: str) -> List[str]:
    """
    Detect grammar mistakes in the text.

    :param text: The transcript to analyze.
    :return: List of grammar mistakes.
    """
    matches = grammar_tool.check(text)
    return [match.message for match in matches]


def analyze_sentiment(text: str) -> Dict:
    """
    Analyzes the given text for sentiment, grammar, and filler words.
    
    :param text: The transcript or speech text.
    :return: A dictionary containing sentiment analysis, filler words, grammar mistakes, and an overall score.
    """
    if not text.strip():
        return {"error": "Empty text provided."}
    
    # 1️⃣ Detect Filler Words
    words = text.lower().split()
    filler_counts = Counter(word for word in words if word in FILLER_WORDS)
    total_words = len(words)
    filler_percentage = round((sum(filler_counts.values()) / total_words) * 100, 2) if total_words > 0 else 0

    # 2️⃣ Calculate Polarity Score
    polarity_score = round(TextBlob(text).sentiment.polarity, 3)

    # 3️⃣ Grammar Checking (Strict Filtering)
    matches = grammar_tool.check(text)

    grammar_mistakes = list(set(  # Remove duplicates
        match.message for match in matches
        if not re.search(r"whitespace|consecutive spaces|too many spaces|extra space", match.message.lower())
    ))
    
    grammar_accuracy = round(100 - (len(grammar_mistakes) / total_words * 100), 2) if total_words > 0 else 100

    # 4️⃣ Compute Overall Score
    overall_score = round(
        (0.4 * ((polarity_score + 1) / 2) * 100) +  # Normalize polarity (-1 to 1) → (0 to 100)
        (0.3 * grammar_accuracy) +
        (0.2 * (100 - filler_percentage)), 2  # Filler words reduce score
    )

    # Final Output
    analysis = {
        "filler_words": dict(filler_counts),
        "filler_word_percentage": filler_percentage,
        "polarity_score": polarity_score,
        "overall_sentiment": "Positive" if polarity_score > 0.1 else "Neutral" if polarity_score > -0.1 else "Negative",
        "grammar_mistakes": grammar_mistakes,
        "grammar_accuracy": grammar_accuracy,
        "overall_score": overall_score
    }
    
    return analysis


# Example 

if __name__ == "__main__":
    transcript = """
    Candidate: Sure, so I had a team member who was not meeting deadlines, and it was affecting our project timeline.
    Candidate: I first tried to understand the reasons behind the delays and offered my help to overcome any obstacles.
    Candidate: We the discussed  workload  identified you know areas where I could provide support.
    Candidate: I also suggested time sooo management techniques grammar_tool to help improve efficiency.
    Interviewer: That's great. How and did the team member ahh  respond to your suggestions?
    Candidate: The team member was actually  receptive to the feedback and implemented the suggestions.
    Candidate: We set up regular check-ins to monitor progress and address any issues promptly."""


    result = analyze_sentiment(transcript)

    # Print results in a formatted JSON
    print(json.dumps(result, indent=4))