import os
import logging
from dotenv import load_dotenv
from google.cloud import aiplatform
from langchain_google_vertexai import VertexAIEmbeddings
from pymongo.errors import AutoReconnect, ConnectionFailure
import time
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Log the environment variables
logger.debug("PROJECT_ID: %s", os.getenv('PROJECT_ID'))
logger.debug("LOCATION: %s", os.getenv('LOCATION'))

# Initialize the AI Platform
aiplatform.init(
    project=os.getenv('PROJECT_ID'),
    location=os.getenv('LOCATION')
)

# Now create the embeddings
embedding_model = VertexAIEmbeddings(
    model_name="text-multilingual-embedding-002",
)

from pymongo.mongo_client import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch

variable_DB = os.getenv('MONGODB_ATLAS_CLUSTER_URI')

logger.debug("MongoDB URI: %s", variable_DB)

def connect_to_mongo(uri, retries=5, delay=5):
    for attempt in range(retries):
        try:
            client = MongoClient(uri)
            # Test the connection
            client.admin.command('ping')
            return client
        except (AutoReconnect, ConnectionFailure) as e:
            logger.error("Attempt %d: Failed to connect to MongoDB: %s", attempt + 1, e)
            time.sleep(delay)
    raise ConnectionFailure("Could not connect to MongoDB after several attempts.")

try:
    # initialize MongoDB python client
    client = connect_to_mongo(variable_DB)
    DB_NAME = "genai"
    COLLECTION_NAME = "support"
    ATLAS_VECTOR_SEARCH_INDEX_NAME = "vector_index"
    MONGODB_COLLECTION = client[DB_NAME][COLLECTION_NAME]

    vector_store = MongoDBAtlasVectorSearch(
        collection=MONGODB_COLLECTION,
        embedding=embedding_model,
        index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
        relevance_score_fn="dotProduct",
    )
except ConnectionFailure as e:
    logger.error("Final failure to connect to MongoDB: %s", e)
    # Handle the error, e.g., exit or notify
