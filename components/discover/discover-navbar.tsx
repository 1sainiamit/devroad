"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, Bookmark, ShoppingCart, ChevronDown, User as UserIcon, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { CartSheet } from "@/components/cart/cart-sheet";

export function DiscoverNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { isAuthenticated, user } = useAuthStore((state) => state);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Fix hydration mismatch for persisted store by only rendering count after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/discover?${params.toString()}`);
    });
    setIsSearchOpen(false);
  };

  const categories = [
    "Self Improvement",
    "Other",
    "Education",
    "Business & Money",
    "Drawing & Painting"
  ];

  const currentCategory = searchParams.get("category");

  return (
    <div className="bg-[#1a1a1a] text-white flex flex-col border-b border-white/10">
      {/* Top Row */}
      <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <span className="font-bold text-2xl sm:text-3xl tracking-tighter text-white">Devroad</span>
        </Link>

        {/* Search Bar — hidden on mobile, visible md+ */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl ml-4">
          <div className="relative flex items-center w-full">
            <div className="absolute left-3 text-white/50">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full h-10 pl-10 pr-4 bg-black text-white border border-transparent rounded-md outline-none focus:border-white/25 transition-all font-medium placeholder:text-white/50"
            />
          </div>
        </form>

        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-black/60 hover:bg-black/80 transition-colors"
            onClick={() => setIsSearchOpen((v) => !v)}
            aria-label="Search"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <Link 
              href="/library" 
              className="flex items-center gap-2 px-2 sm:px-3 h-10 rounded-md border border-white/20 hover:bg-white/10 transition-colors font-medium text-sm"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          ) : null}
          
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center px-2 sm:px-4 h-10 bg-[#e5e5e5] text-black hover:bg-white rounded-md font-medium text-sm transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Start selling</span>
            <span className="sm:hidden text-xs font-bold">Sell</span>
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 h-10 bg-black rounded-md hover:bg-black/80 border border-transparent transition-colors font-medium text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            {mounted ? itemCount : 0}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar — expands below top row */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-white/50">
                <Search className="w-5 h-5" />
              </div>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full h-10 pl-10 pr-4 bg-black text-white border border-white/20 rounded-md outline-none focus:border-white/40 transition-all font-medium placeholder:text-white/50"
              />
            </div>
          </form>
        </div>
      )}

      {/* Bottom Row — categories */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-white/80 whitespace-nowrap">
          <Link href="/discover" className={`px-3 py-1.5 rounded-full border ${!currentCategory ? "bg-black text-white border-white/20" : "border-transparent hover:text-white transition-colors"}`}>
            All
          </Link>
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/discover?category=${encodeURIComponent(category)}`} 
              className={`px-3 py-1.5 rounded-full border ${currentCategory === category ? "bg-black text-white border-white/20" : "border-transparent hover:text-white transition-colors"}`}
            >
              {category}
            </Link>
          ))}
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            More <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center ml-4 pl-4">
          {isAuthenticated && user ? (
            <Link href="/settings">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="Avatar" width={24} height={24} className="rounded-full" />
              ) : (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </Link>
          ) : (
            <Link href="/login" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
               <UserIcon className="w-4 h-4 text-white" />
            </Link>
          )}
        </div>
      </div>
      
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
}
