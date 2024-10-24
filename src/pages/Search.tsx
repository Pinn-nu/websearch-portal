import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResult from "@/components/SearchResult";
import { toast } from "sonner";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with backend search API
      // Simulated results for now
      const mockResults = [
        {
          id: 1,
          title: "Sample Document 1",
          snippet: "This is a sample search result that matches your query...",
          content: "Full content of the document would be displayed here...",
        },
        {
          id: 2,
          title: "Sample Document 2",
          snippet: "Another relevant search result for your consideration...",
          content: "Complete content of the second document...",
        },
      ];
      setResults(mockResults);
    } catch (error) {
      toast.error("Search failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
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
          {results.map((result) => (
            <SearchResult key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;