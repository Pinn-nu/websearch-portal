import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface SearchHistoryItem {
  id: number;
  query: string;
  timestamp: string;
  results: Array<{
    id: number;
    title: string;
    snippet: string;
  }>;
}

const History = () => {
  const navigate = useNavigate();
  
  // TODO: Replace with actual API call
  const mockHistory: SearchHistoryItem[] = [
    {
      id: 1,
      query: "React hooks example",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      results: [
        {
          id: 1,
          title: "Understanding React Hooks",
          snippet: "A comprehensive guide to React Hooks...",
        },
      ],
    },
    {
      id: 2,
      query: "TypeScript tutorial",
      timestamp: new Date(Date.now() - 7200000).toLocaleString(),
      results: [
        {
          id: 2,
          title: "TypeScript for Beginners",
          snippet: "Learn TypeScript from scratch...",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Search History</h1>
        <div className="space-y-4">
          {mockHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-blue-600">
                    {item.query}
                  </h2>
                  <span className="text-sm text-gray-500">{item.timestamp}</span>
                </div>
                <div className="space-y-2">
                  {item.results.map((result) => (
                    <div key={result.id} className="pl-4 border-l-2 border-gray-200">
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-gray-600">{result.snippet}</p>
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