from packages.websearch.retriever import filter_retriever as retrieve
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
from langserve import add_routes
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from datetime import datetime
import logging
import uvicorn
import sys
import os

# Add the directory containing 'packages' to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# Load the .env file
load_dotenv()
variable_DB = os.getenv('MONGODB_ATLAS_CLUSTER_URI')

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any origin, for production use specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers, including custom headers
)

try:
    # Connect to MongoDB using the URI from the environment variable
    client = MongoClient(variable_DB, serverSelectionTimeoutMS=5000)  # Add a timeout for server selection
    client.server_info()  # Force a call to check the connection
    db = client.genai
    users_collection = db.users
    search_history_collection = db.search_history
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise HTTPException(status_code=500, detail="Database connection error")

# Simulated session storage
session_store = {}

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Edit this to add the chain
add_routes(
    app,
    retrieve,
    path="/websearch", 
    playground_type="default",
    disabled_endpoints=("invoke", "batch", "config_hashes"),
)

@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")

# User model
class User(BaseModel):
    username: str
    password: str

# Login endpoint with password hashing
# แก้ไขให้ session นานขึ้น โดยที่แค่ refresh ก็ยังเข้าใช้งานได้อยู่
@app.post("/login")
async def login(user: User):#, request: Request):
    # Use find_one instead of get for MongoDB
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    ## Store username in session
    #session_id = str(id(request))
    #session_store[session_id] = user.username
    response = JSONResponse(content={"message": "Login successful"})
    #response.set_cookie(key="session_id", value=session_id)
    return response

## Dependency to get the current user from session
#def get_current_user(request: Request):
#    session_id = request.cookies.get("session_id")
#    if session_id is None or session_id not in session_store:
#        raise HTTPException(status_code=401, detail="Not authenticated")
#    return session_store[session_id]

# Function to add a query to the search history collection
def add_query_to_search_history(username, query, result):
    try:
        # Insert the query into the search history collection
        search_history_collection.insert_one({
            "username": username,
            "query": query,
            "result": result,
            "timestamp": datetime.now()
        })
        logger.info(f"Query added to search history for user: {username}")
    except Exception as e:
        logger.error(f"Error adding query to search history: {e}")

# Define the request body structure for query
class QueryRequest(BaseModel):
    query: str

# Define an endpoint to receive query and retrieve results
@app.post("/retrieve")
async def retrieve_data(username: str,query_request: QueryRequest):#, request: Request):
    #current_user = get_current_user(request)
    #current_user = "test-1"
    query = query_request.query
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        logger.info(f"Query received from {username}: {query}")
        
        # Log the query to the search history
        add_query_to_search_history(username, query, result)
        
        # Attempt to invoke the query
        result = retrieve.invoke(query)
        logger.info(f"Result for query '{query}': {result}")
        
        # Log the query to the search history
        #add_query_to_search_history(current_user, query, result)
        
        return result
    except Exception as e:
        logger.error(f"Error retrieving data for {username} with query '{query}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to get the last search history entry by username
@app.get("/search_history/{username}")
async def get_search_history(username: str):
    try:
        logger.info(f"Retrieving search history for user: {username}")
        
        # Retrieve all search history entries for the given username
        entries = list(search_history_collection.find(
            {"username": username},
            sort=[("timestamp", -1)]  # Sort by timestamp in descending order
        ))
        
        if not entries:
            logger.info(f"No search history found for user: {username}")
            return {"message": "No search history found"}
        
        logger.info(f"Search history retrieved for user: {username}")
        return entries
    except Exception as e:
        logger.error(f"Error retrieving search history for user {username}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8101)  # Changed port to 8101
