import requests
import os
from dotenv import load_dotenv

load_dotenv()

class GroqClient:
    def __init__(self, api_key: str = None, model: str = "llama3-8b-8192"):
        """
        Initializes the Groq LLM client.
        
        :param api_key: API key for Groq. If None, it fetches from environment variables.
        :param model: The Groq model to use.
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model = model
        # The correct API URL is already https://api.groq.com/v1/chat/completions
        # (the previous implementation was correct)
        self.api_url = "https://api.groq.com/v1/chat/completions"
        
        if not self.api_key:
            raise ValueError("Groq API key is required. Set GROQ_API_KEY as an env variable or pass it explicitly.")

    def generate_response(self, prompt: str, system_prompt: str = "You are an AI assistant.", 
                          temperature: float = 0.7, max_tokens: int = 512):
        """
        Sends a prompt to Groq and returns the response.
        
        :param prompt: The input prompt for the model.
        :param system_prompt: Optional system prompt to set context.
        :param temperature: Controls randomness (0 = deterministic, 1 = more random).
        :param max_tokens: Maximum tokens in the response.
        :return: The response text from Groq.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system_prompt},
                         {"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        try:
            # Print request details for debugging
            print(f"Making request to: {self.api_url}")
            print(f"Model being used: {self.model}")
            # Don't print the full API key for security
            print(f"API key (first 5 chars): {self.api_key[:5]}...")
            
            response = requests.post(
                self.api_url, 
                json=payload, 
                headers=headers,
                timeout=60
            )
            
            # Print response status for debugging
            print(f"Response status code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"Error response: {response.text}")
                
            response.raise_for_status()  # Raise exception for 4XX/5XX responses
            
            result = response.json()
            return result["choices"][0]["message"]["content"].strip()
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Request error: {str(e)}"
            if hasattr(e, 'response') and e.response:
                error_msg += f"\nStatus code: {e.response.status_code}"
                try:
                    error_msg += f"\nResponse: {e.response.json()}"
                except:
                    error_msg += f"\nResponse: {e.response.text}"
            raise Exception(error_msg)

    def list_available_models(self):
        """List all available models from Groq API."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(
                "https://api.groq.com/v1/models",
                headers=headers,
                timeout=30
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Error listing models: {str(e)}"
            if hasattr(e, 'response') and e.response:
                error_msg += f"\nStatus code: {e.response.status_code}"
                try:
                    error_msg += f"\nResponse: {e.response.json()}"
                except:
                    error_msg += f"\nResponse: {e.response.text}"
            raise Exception(error_msg)

# Example Usage
if __name__ == "__main__":
    client = GroqClient()
    
    # Check available models first
    try:
        models = client.list_available_models()
        print("Available models:")
        for model in models.get("data", []):
            print(f"- {model['id']}")
            
        # Use one of the available models
        if models.get("data"):
            client.model = models["data"][0]["id"]
            print(f"Using model: {client.model}")
    except Exception as e:
        print(f"Couldn't list models: {str(e)}")
        print("Continuing with default model...")
    
    # Test the client
    try:
        response = client.generate_response(
            prompt="What are the key skills required for a Machine Learning Engineer?"
        )
        print("Response:", response)
    except Exception as e:
        print(f"Error generating response: {str(e)}")