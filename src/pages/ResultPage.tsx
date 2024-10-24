import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

interface SearchResult {
  id: number;
  title: string;
  snippet: string;
  content: string;
}

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as SearchResult;

  if (!result) {
    return <div>No result found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-2">
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
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{result.title}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">{result.snippet}</p>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{result.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;