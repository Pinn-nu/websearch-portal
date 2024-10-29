from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .retriever import filter_retriever
from .function import pretty_print_docs as print_docs

app = FastAPI()

# Define the request body structure
class QueryRequest(BaseModel):
    query: str

# Define an endpoint to receive query and retrieve results
@app.post("/retrieve")
async def retrieve_data(query_request: QueryRequest):
    query = query_request.query  # This automatically gets the "query" from the request body
    try:
        result = filter_retriever.invoke(query)
        # If you have a function to format results, use it here
        return print_docs(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


## Run บนนี้จะไม่มี frontend demo