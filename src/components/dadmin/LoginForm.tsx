
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an actual login call, e.g., with Firebase Auth.
      // For this public-mode app, we'll simulate a simple check.
      // This is a placeholder and should be replaced with real auth logic.
      if (username === "admin" && password === "password") {
        // This is a placeholder for session creation.
        // In a real app, you would POST to an API route to set a session cookie.
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const nextUrl = searchParams.get('next') || '/dadmin';
        router.push(nextUrl);
        router.refresh();
      } else {
        // Simplified login logic for public mode
        setError("Invalid credentials for this demo.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>
    </form>
  );
}
