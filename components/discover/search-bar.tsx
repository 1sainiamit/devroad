"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

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
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, creators..."
          className="w-full h-14 pl-12 pr-4 text-lg border-4 border-black rounded-full outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 h-10 px-6 bg-primary text-black font-bold rounded-full border-2 border-black hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </div>
    </form>
  );
}
