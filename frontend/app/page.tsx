"use client";
import { useState } from 'react';
import { Search, Zap } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">
        Bridge the Gap to <span className="text-blue-600">Better Value.</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl">
        MoolyaSetu uses AI to find the smartest deals across Amazon, Flipkart, and eBay instantly.
      </p>

      <div className="relative w-full max-w-xl group">
        <input 
          type="text"
          placeholder="What are you looking for today?"
          className="w-full px-6 py-4 text-lg rounded-2xl border border-slate-200 shadow-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Search size={24} />
        </button>
      </div>

      <div className="mt-12 flex gap-6 text-slate-400 grayscale opacity-70">
        <span>Amazon</span>
        <span>Flipkart</span>
        <span>eBay</span>
      </div>
    </div>
  );
}
