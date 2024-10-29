# Option_1.1

from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainFilter
from .model import llm
from .config import vector_store

_filter = LLMChainFilter.from_llm(llm)

filter_retriever = ContextualCompressionRetriever(
    base_compressor=_filter,
    base_retriever=vector_store.as_retriever(
        search_type = "similarity",
        search_kwargs={'score_threshold': 0.77, 'k': 10}
        )
)


# Option_4

#from langchain.retrievers.multi_query import MultiQueryRetriever
#from config import vector_store
#from model import llm
#
#retriever_from_llm = MultiQueryRetriever.from_llm(
#    retriever=vector_store.as_retriever(search_kwargs={"k": 10, "include_metadata": True, 'score_threshold': 0.77}), 
#    llm=llm
#)