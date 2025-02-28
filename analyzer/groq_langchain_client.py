import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq  # Correct import from the langchain_groq package
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

load_dotenv()

class LangChainGroqClient:
    def __init__(self, api_key: str = None, model: str = "llama3-8b-8192"):
        """
        Initializes the Groq LLM client using LangChain.
        
        :param api_key: API key for Groq. If None, it fetches from environment variables.
        :param model: The Groq model to use.
        """
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model = model
        
        if not self.api_key:
            raise ValueError("Groq API key is required. Set GROQ_API_KEY as an env variable or pass it explicitly.")
        
        # Initialize the chat model
        self.chat_model = ChatGroq(
            api_key=self.api_key,
            model_name=self.model,
            temperature=0.7,
            max_tokens=512
        )

    def generate_response(self, prompt: str, system_prompt: str = "You are an AI assistant.", 
                         temperature: float = 0.7, max_tokens: int = 512):
        """
        Uses the LangChain ChatGroq model to generate a response.
        
        :param prompt: The input prompt for the model.
        :param system_prompt: Optional system prompt to set context.
        :param temperature: Controls randomness (0 = deterministic, 1 = more random).
        :param max_tokens: Maximum tokens in the response.
        :return: The response text from Groq.
        """
        # Update the parameters
        self.chat_model.temperature = temperature
        self.chat_model.max_tokens = max_tokens
        
        try:
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=prompt)
            ]
            
            # Generate and return the response
            response = self.chat_model.invoke(messages)
            return response.content
            
        except Exception as e:
            error_msg = f"LangChain Groq error: {str(e)}"
            raise Exception(error_msg)

# Example Usage
if __name__ == "__main__":
    client = LangChainGroqClient()
    
    # Simple generation example
    try:
        response = client.generate_response(
            prompt="What are the key skills required for a Machine Learning Engineer?",
            system_prompt="You are a helpful career advisor specializing in tech roles."
        )
        print("Basic response:", response)
    except Exception as e:
        print(f"Error generating response: {str(e)}")