import re
from typing import List, Dict

def format_transcript(transcript: str) -> List[Dict[str, str]]:  
 
    
    pattern = re.compile(r"([\w\s]+) \(\d{2}/\d{2}/\d{4}, \d{2}:\d{2} [APM]{2}\): (.*?)(?=(?: [\w\s]+ \(\d{2}/\d{2}/\d{4}, \d{2}:\d{2} [APM]{2}\):)|$)", re.DOTALL)

    formatted_messages = []  
    for match in pattern.findall(transcript):  
        user, content = match  
        formatted_messages.append({"user": user.strip(), "content": content.strip()})  

    return formatted_messages  



if __name__ == "__main__":  
    raw_transcript = """Manish Bulchandani (02/28/2025, 03:39 AM): Good morning! Thanks for joining us today. Can you start by telling me a little about yourself?  Rohit Sharma (02/28/2025, 03:39 AM): Good morning! Thank you for having me. My name is Rohit Sharma, and I have a Bachelor’s degree in Computer Science. I’ve been working as a software developer for about three years now, primarily focusing on web applications and cloud-based systems. I’m proficient in Python and JavaScript, and I’ve worked on projects involving RESTful APIs, microservices, and AWS.  Manish Bulchandani (02/28/2025, 03:40 AM): That’s great to hear! Can you tell me about a project you’ve worked on that you’re particularly proud of?"""

    structured_transcript = format_transcript(raw_transcript)  
    for entry in structured_transcript:  
        print(entry)  
