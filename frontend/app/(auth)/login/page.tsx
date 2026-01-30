"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { LOCAL_STORAGE } from "@/lib/auth.storage";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      // Login call to backend and it return token.
      const token = await login(email, password);

      // Store the token in local storage.
      LOCAL_STORAGE.setToken(token.data.token);
      window.location.href = "/dashboard";

      setEmail("");
      setPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <Button className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
          Register
        </Link>
      </p>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
