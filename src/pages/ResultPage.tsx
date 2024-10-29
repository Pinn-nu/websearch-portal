import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

interface SearchResult {
  metadata: {
    source: string;
    collection: string;
    title: string;
    author: string;
    createdate: string;
  };
  page_content: string;
}

const ResultPage = () => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = localStorage.getItem("selectedResult");
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      setResult(parsedResult);
    }
  }, []);

  if (!result) {
    return <div>No result found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            {/* 
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/search")}
              className="hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
            </Button>
            */}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{result.metadata.title}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2"><strong>Source:</strong> {result.metadata.source}</p>
          <p className="text-gray-600 mb-2"><strong>Author:</strong> {result.metadata.author}</p>
          <p className="text-gray-600 mb-2"><strong>Created on:</strong> {new Date(result.metadata.createdate).toLocaleString()}</p>

          <div className="prose max-w-none mt-4">
            <p className="whitespace-pre-wrap">{result.page_content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
