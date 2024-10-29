from langserve.client import RemoteRunnable

runnable = RemoteRunnable("http://localhost:8100/websearch")

query = "ขอคืนเครื่อง"
result = runnable.invoke(query)
print(result)