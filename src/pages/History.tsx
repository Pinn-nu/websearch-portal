import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SearchHistoryItem {
  _id: string;
  query: string;
  timestamp: string;
  result: any;
}

const History = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8101/search_history/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch search history");
        }
        const data = await response.json();
        setSearchHistory(data);
      } catch (error) {
        console.error("Error fetching search history:", error);
        // Fallback to local storage if server fetch fails
        setSearchHistory(getSearchHistory());
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Retrieve search history from localStorage
  const getSearchHistory = (): SearchHistoryItem[] => {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
  };

  const handleQueryClick = (query: string) => {
    navigate("/search", { state: { query } });
  };

  const handleResultClick = (result: any) => {
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
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Search History</h1>
        <div className="space-y-4">
          {searchHistory.map((item) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2
                    className="text-lg font-semibold text-blue-600 cursor-pointer"
                    onClick={() => handleQueryClick(item.query)}
                  >
                    {item.query}
                  </h2>
                  <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  {item.result.map((result: any, index: number) => (
                    <div
                      key={index}
                      className="pl-4 border-l-2 border-gray-200 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <h3 className="font-medium hover:text-blue-600">{result.metadata.title}</h3>
                      <p className="text-sm text-gray-600">{result.page_content.slice(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;