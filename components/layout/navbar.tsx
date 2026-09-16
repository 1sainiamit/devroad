"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full" />
          <span className="font-bold text-2xl tracking-tighter">Devroad</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 font-bold">
        <Link href="/discover" className="hover:underline underline-offset-4 decoration-2">Discover</Link>
        <Link href="/features" className="hover:underline underline-offset-4 decoration-2">Features</Link>
        <Link href="/pricing" className="hover:underline underline-offset-4 decoration-2">Pricing</Link>
        <Link href="/blog" className="hover:underline underline-offset-4 decoration-2">Blog</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Button asChild className="text-base px-6 bg-secondary text-black hover:bg-secondary/90">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <>
            <Link href="/login" className="hidden md:block font-bold hover:underline underline-offset-4 decoration-2">
              Login
            </Link>
            <Button asChild className="text-base px-6">
              <Link href="/signup">Start Selling</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
