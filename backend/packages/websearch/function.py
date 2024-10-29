# Print function
def pretty_print_docs(docs):
    print(f"\n{'-' * 100}\n".join([f"Document {i+1}:\n" + f"source: {d.metadata['source']}\n\n" + d.page_content for i, d in enumerate(docs)]))
