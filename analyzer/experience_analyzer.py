from sentence_transformers import SentenceTransformer, util
from typing import List, Dict
import json
import re
# from groq_client import GroqClient
from groq_langchain_client import LangChainGroqClient

def extract_experience(transcript: List[Dict[str, str]], similarity_threshold: float = 0.4, margin: int = 1) -> List[str]:
    """
    Extracts relevant experience details from a formatted transcript.
    
    :param transcript: List of formatted transcript objects [{"user": "Name", "content": "Message"}]
    :param similarity_threshold: Cosine similarity threshold to consider a match
    :param margin: Number of adjacent sentences to include for context
    :return: List of extracted experience-related sentences
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    experience_prompts = [
        "I worked at", "I have experience in", "Previously, I was at", "Before that, I worked at", 
        "My previous company was", "I have been working as", "My last role was at", "I was employed at",
        "I started my career at", "Currently, I am working at",
        "I was responsible for", "My role involved", "I have been handling", "My work includes", 
        "I specialize in", "I contribute to", "I manage", "I lead a team for", "I developed",
        "I did an internship at", "I was an intern at", "I worked as a freelancer for", 
        "I contributed to a project at", "I was a consultant for", "I had a contract role at",
        "I have X years of experience in", "With X years of experience in", 
        "For the past X years, I have worked on", "Over the last X years, I have been involved in", 
        "I bring X years of experience in"
    ]
    
    sentences = [entry['content'] for entry in transcript]
    response_embeddings = model.encode(sentences, convert_to_tensor=True)
    prompt_embeddings = model.encode(experience_prompts, convert_to_tensor=True)
    
    similarity_matrix = util.cos_sim(response_embeddings, prompt_embeddings)
    
    matched_indices = [i for i in range(len(sentences)) if max(similarity_matrix[i]) > similarity_threshold]
    
    expanded_indices = set()
    for idx in matched_indices:
        for i in range(idx - margin, idx + margin + 1):
            if 0 <= i < len(sentences):
                expanded_indices.add(i)
    
    extracted_experience = [sentences[i] for i in sorted(expanded_indices)]
    
    return extracted_experience


def analyze_experience_with_llm(extracted_experience: List[str], job_description: str) -> Dict:
    """
    Uses Groq LLM to analyze the extracted experience and return structured metrics.

    :param extracted_experience: List of experience-related sentences.
    :param job_description: The job description for comparison.
    :return: JSON metrics evaluating the candidate's experience.
    """
    if not extracted_experience:
        return {"error": "No relevant experience found in the transcript."}

    experience_text = " ".join(extracted_experience)
    
    prompt = f"""
    Given the following job description and candidate's experience, evaluate the fitment:

    Job Description:
    {job_description}

    Candidate's Experience:
    {experience_text}

    Provide a response in **valid JSON format only** with the following structure:
    {{
        "experience_match": 75,
        "key_strengths": ["Python", "Machine Learning"],
        "missing_skills": ["Cloud deployment"],
        "complexity_handled": 7,
        "overall_fit_score": 70
    }}

    STRICT REQUIREMENTS:
    - Return only JSON, with no explanations, no formatting issues.
    - Ensure all keys are present even if empty.
    - Always use double quotes for keys and string values.
    - Do not wrap the response in markdown code blocks (e.g., no ```json ... ```).
    """

    groq_client = LangChainGroqClient()
    response = groq_client.generate_response(prompt).strip()

    # Clean the response if it contains unwanted markdown/code blocks
    if response.startswith("```json"):
        response = response.split("```json")[1]
        response = response.split("```")[0] if "```" in response else response
    elif response.startswith("```"):
        response = response.split("```")[1]
        response = response.split("```")[0] if "```" in response else response

    # Remove any inline comments (in case LLM still includes them)
    response = re.sub(r'//.*', '', response)

    # Try extracting JSON using a regex match (fallback)
    json_match = re.search(r'{[\s\S]*}', response)
    if json_match:
        response = json_match.group(0)

    # Attempt JSON parsing
    try:
        analysis = json.loads(response)
        
        # Ensure all expected keys exist
        expected_keys = ["experience_match", "key_strengths", "missing_skills", 
                         "complexity_handled", "overall_fit_score"]
        for key in expected_keys:
            if key not in analysis:
                analysis[key] = None  # Fill missing keys with None
                
    except json.JSONDecodeError as e:
        analysis = {
            "error": f"Failed to parse LLM response: {str(e)}",
            "raw_response": response[:500]
        }
    except Exception as e:
        analysis = {
            "error": f"Unexpected error: {str(e)}",
            "raw_response": response[:500] if isinstance(response, str) else str(response)[:500]
        }

    return analysis


def analyze_experience(transcript,job_description):
    extracted_experience = extract_experience(transcript)
    analysis_metrics = analyze_experience_with_llm(extracted_experience, job_description)
    return analysis_metrics



# Example Usage
if __name__ == "__main__":
    formatted_transcript = [
        {"user": "Manish Bulchandani", "content": "Hello there. My name is Manish. What's your name?"},
        {"user": "Rohit Sharma", "content": "My Name is Rohit Sharma, How are you"},
        {"user": "Manish Bulchandani", "content": "I have 5 years of experience in Python and AI."},
        {"user": "Manish Bulchandani", "content": "Previously, I worked at Google as a Machine Learning Engineer for 3 years."},
        {"user": "Manish Bulchandani", "content": "Before that, I was at Meta, working on NLP projects for 2 years."},
        {"user": "Manish Bulchandani", "content": "I also did an internship at Tesla in 2018."}
    ]
    
    job_description = """
    We are looking for a Machine Learning Engineer with expertise in Python, deep learning, and NLP.
    The candidate should have experience in deploying AI models and handling large-scale data.
    """
    analysis_metrics= analyze_experience(formatted_transcript,job_description)

    print(json.dumps(analysis_metrics, indent=4))
