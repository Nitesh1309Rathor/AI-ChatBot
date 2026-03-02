"use client";

import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await apiFetch("/api/auth/me");
        router.replace("/chats");
      } catch {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <div className="h-screen bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 flex items-center justify-center p-6">{children}</div>;
}
