import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SearchResultProps {
  result: {
    id: number;
    title: string;
    snippet: string;
    content: string;
  };
}

const SearchResult = ({ result }: SearchResultProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h2
          className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer mb-2"
          onClick={() => setIsOpen(true)}
        >
          {result.title}
        </h2>
        <p className="text-gray-600">{result.snippet}</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{result.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap">{result.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchResult;