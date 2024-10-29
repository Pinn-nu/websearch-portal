from pymongo import MongoClient
from passlib.context import CryptContext

import os
import dotenv

dotenv.load_dotenv()

# MongoDB Setup
client = MongoClient(os.getenv("MONGODB_ATLAS_CLUSTER_URI"))
db = client.genai
users_collection = db.users

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to create a new user with hashed password and empty query history
def create_user(username, password):
    # Check if the user already exists
    if users_collection.find_one({"username": username}):
        print(f"User '{username}' already exists.")
        return

    # Hash the password
    hashed_password = pwd_context.hash(password)
    
    # Insert the new user into the collection with an empty queries list
    users_collection.insert_one({
        "username": username,
        "password": hashed_password,
        #"queries": []
    })
    print(f"User '{username}' created successfully.")

# Function to add a query to a user's history
#def add_query_to_user(username, query):
#    # Find the user and update their queries list
#    users_collection.update_one(
#        {"username": username},
#        {"$push": {"queries": query}}
#    )
#    print(f"Query '{query}' added to user '{username}'.")

# Helper function to verify password during login
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Creating a user with a hashed password
create_user("test", "test")

# Adding a query to a user's history
#add_query_to_user("test-1", "ขอสิทธิ์ Admin")
