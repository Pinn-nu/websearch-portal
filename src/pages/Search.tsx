import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Home, History, LogOut, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SearchFilters {
  title?: string;
  date?: string;
  category?: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8101/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          filters,
        }),
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

      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4">
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
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Filter by title..."
                  onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                />

                <Input
                  type="date"
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/result", { state: result })}
            >
              <h2 className="text-xl font-semibold text-primary hover:underline mb-2">
                {result.title}
              </h2>
              <p className="text-gray-600 mb-2">
                {result.snippet}
              </p>
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
  );
};

export default Search;