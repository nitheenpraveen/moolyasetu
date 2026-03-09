"use client";

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchDeals } from './actions';
import ProductCard from "@/components/ProductCard";

export default function MoolyaSetu() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query) return;

    startTransition(async () => {
      const response = await fetchDeals(query);
      if (response.success) {
        setResults(response.data);
        setHasSearched(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. HERO SECTION */}
      <section className={cn(
        "transition-all duration-700 ease-in-out flex flex-col items-center justify-center px-4",
        hasSearched ? "pt-10 pb-10" : "pt-32 pb-20"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">
            <Sparkles size={12} className="mr-1" /> AI-Powered Comparison v16.1
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
            Moolya<span className="text-blue-600">Setu</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
            The bridge between market chaos and absolute value. 
            Find the smartest deals across Amazon, eBay, and Flipkart.
          </p>
        </motion.div>

        {/* 2. SEARCH ENGINE BAR */}
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Search for a product (e.g. iPhone 15 Pro)..."
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-lg transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isPending}
            className="absolute right-3 top-3 bottom-3 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 disabled:bg-slate-300 transition-all flex items-center gap-2"
          >
            {isPending ? "Analysing..." : "Compare"}
          </button>
        </form>
      </section>

      {/* 3. DYNAMIC RESULTS GRID */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" /> 
                  Best Value Results for "{query}"
                </h2>
                <div className="text-sm text-slate-400 font-medium">
                  {results.length} smart matches found
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((product, idx) => (
                  <motion.div
                    key={product.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. EMPTY STATE */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 opacity-40 grayscale">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 border-2 border-dashed border-slate-200 rounded-3xl" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Utility function for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// Minimal Badge Component (Internal to keep file clean)
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}
