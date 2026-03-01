"use client";
import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";
import ChatsClientLayout from "./clientLayout";
import { apiFetch } from "@/lib/api";
import { useEffect } from "react";

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  console.log(token);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Try calling protected route
        await apiFetch("/api/auth/me");
      } catch {
        // Not authenticated → stay on login/register
        // If success → user is authenticated
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]);
  return <ChatsClientLayout>{children}</ChatsClientLayout>;
}
