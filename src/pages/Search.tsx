import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Home, History, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  date: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allTitles, setAllTitles] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch all titles from the database
    const fetchTitles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8101/all-titles");
        if (!response.ok) throw new Error("Failed to fetch titles");
        const data = await response.json();
        setAllTitles(data);
      } catch (error) {
        toast.error("Failed to load titles");
      }
    };
    fetchTitles();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8101/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
      toast.success("Search completed successfully");
    } catch (error) {
      toast.error("Search failed. Please try again.");
      console.error("Search error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const openResult = (result: SearchResult) => {
    localStorage.setItem("selectedResult", JSON.stringify(result));
    window.open("/result", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="hover:bg-primary/90 text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/history")}
              className="hover:bg-primary/90 text-white"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-primary/90 text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex max-w-6xl mx-auto pt-8 px-4">
        {/* Sidebar with all titles */}
        <div className="w-1/4 mr-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-primary mb-4">All Documents</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {allTitles.map((title) => (
                  <div
                    key={title.id}
                    onClick={() => openResult(title)}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                  >
                    {title.title}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openResult(result)}
              >
                <h2 className="text-xl font-semibold text-primary hover:underline mb-2">
                  {result.title}
                </h2>
                <p className="text-gray-600 mb-2">{result.snippet}</p>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>{result.category}</span>
                  <span>•</span>
                  <span>{new Date(result.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;