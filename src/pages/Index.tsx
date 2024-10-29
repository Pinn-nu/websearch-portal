import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";  // Import axios to make HTTP requests
import { useAuth } from "@/context/AuthContext"; // Import the auth context

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();   

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8101/login", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        login(); // Set the user as authenticated
        toast.success("Login successful!");
        navigate("/search", { state: { username } }); // Pass username to the search page
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Invalid username or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img src="./src/components/cute_logo.png" alt="Cute Logo" className="w-44 h-44 mb-4" />
          <h1 className="text-3xl font-bold text-center text-gray-800">Welcome</h1>
          <p className="text-center text-gray-600">Sign in to access the RAG Search Engine</p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"  
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Index;
