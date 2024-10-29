from langchain_google_vertexai.model_garden import ChatAnthropicVertex
from langchain_google_vertexai import HarmBlockThreshold, HarmCategory  

project = "sgdzanl-itonecs-genai-rd"
location = "europe-west1"

llm = ChatAnthropicVertex(
    model_name="claude-3-5-sonnet@20240620",
    project=project,
    location=location,
    temperature=0,
    max_tokens=8192,
    timeout=None,
    safety_settings={  
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,  
    },  
)