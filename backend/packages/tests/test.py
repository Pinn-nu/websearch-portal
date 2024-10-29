from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv("./backend/.env")

# Debugging: Check if the file is loaded
if os.path.exists("./backend/.env"):
    print("The .env file was found and loaded.")
else:
    print("The .env file was not found.")

# Debugging: Print the environment variables
print("MONGODB_ATLAS_CLUSTER_URI:", os.getenv('MONGODB_ATLAS_CLUSTER_URI'))
print("PROJECT_ID:", os.getenv('PROJECT_ID'))
print("LOCATION:", os.getenv('LOCATION'))
