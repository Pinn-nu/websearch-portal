import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, History, LogOut } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (location.state?.query) {
      setQuery(location.state.query);
      handleSearch(location.state.query);
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSearch = async (searchQuery: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8101/retrieve", {
        query: searchQuery,
      });

      const serverResults = response.data;
      setResults(serverResults);
      toast.success("Search successful!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Search failed. Please try again.";
        toast.error(`Search failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Search error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const openResult = (result: any) => {
    localStorage.setItem("selectedResult", JSON.stringify(result));
    window.open("/result", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/history")}
              className="hover:bg-gray-100"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
        
        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.metadata._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openResult(result)}
              >
                <h2 className="text-lg font-semibold text-blue-600 hover:underline mb-2">
                  {result.metadata.title}
                </h2>
                <p className="text-gray-600 mb-2">Author: {result.metadata.author}</p>
                <p className="text-gray-600 mb-2">Source: {result.metadata.source}</p>
                <p className="text-gray-500">{result.page_content.slice(0, 150)}...</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No results found. Please try a different query.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
