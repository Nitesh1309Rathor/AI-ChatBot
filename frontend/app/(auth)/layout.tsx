"use client";

import { Spinner } from "@/components/ui/spinner";
import { isAuthenticated } from "@/lib/auth.guard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [authenticate, setAuthenticate] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/chats");
    } else {
      setAuthenticate(true);
    }
    setChecking(false);
  }, []);

  if (!authenticate) {
    return null;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <div className="h-screen bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 flex items-center justify-center p-6">{children}</div>;
}
