"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo credentials: admin@paom.org / admin123
    if (email === "admin@paom.org" && password === "admin123") {
      document.cookie = "paom-admin=true; path=/; max-age=86400";
      router.push("/admin");
    } else {
      setError("Invalid credentials. Use admin@paom.org / admin123 for demo.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="/" />
        </div>
        <Card padding="lg">
          <h1 className="text-center text-2xl font-bold">Admin Login</h1>
          <p className="mt-2 text-center text-sm text-muted">
            Sign in to the PAoM Journal administration portal
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="admin@paom.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-paom-red dark:bg-red-900/20">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted">
            Demo: admin@paom.org / admin123
          </p>
        </Card>
      </div>
    </div>
  );
}
