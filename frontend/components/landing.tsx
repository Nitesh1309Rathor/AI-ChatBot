"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col">
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl opacity-40" />

      <div className="absolute top-37.5 left-37.5 w-100 h-100 bg-indigo-500/30 rounded-full blur-3xl animate-float -z-10" />
      <div className="absolute bottom-50 right-37.5 w-125 h-125 bg-purple-500/30 rounded-full blur-3xl animate-float -z-10" />

      <header className="flex justify-between items-center px-8 py-6 backdrop-blur-md bg-background/40 border-b border-border/30">
        <h1 className="text-xl font-semibold tracking-tight">Helping - Hand AI</h1>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-muted cursor-pointer">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-blue-500 text-white hover:bg-blue-700 transition cursor-pointer ">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-6xl font-bold tracking-tight mb-6 leading-tight animate-fade-in">
          Intelligent AI Chat
          <span className="block bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mt-4">
            Built with Clean Architecture
          </span>
        </h2>

        <p className="text-muted-foreground max-w-2xl mb-10 text-lg leading-relaxed animate-fade-in delay-150">
          Real-time streaming responses, JWT authentication, persistent conversations, and production-ready design.
        </p>

        <Link href="/register">
          <Button
            size="lg"
            className="
              px-10 py-6 text-lg rounded-xl
              bg-linear-to-r from-indigo-500 to-purple-500
              text-white
              shadow-lg
              hover:scale-105 hover:shadow-xl
              transition-all duration-200
              animate-fade-out 
              cursor-pointer
            "
          >
            Start Chatting
          </Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} HelpingHand AI</footer>
    </div>
  );
}
