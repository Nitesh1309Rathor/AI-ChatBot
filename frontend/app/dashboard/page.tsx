"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { isAuthenticated } from "@/lib/auth.guard";
import { LOCAL_STORAGE } from "@/lib/auth.storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [authenticate, setAuthenticate] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthenticate(true);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!authenticate) {
    return null;
  }

  function handleLogout() {
    LOCAL_STORAGE.removeToken();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
