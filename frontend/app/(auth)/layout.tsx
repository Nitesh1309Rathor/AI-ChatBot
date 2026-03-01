"use client";

import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Try calling protected route
        await apiFetch("/api/auth/me");

        // If success → user is authenticated
        router.replace("/chats");
      } catch {
        // Not authenticated → stay on login/register
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <div className="h-screen bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 flex items-center justify-center p-6">{children}</div>;
}
