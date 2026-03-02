"use client";
import { useState, useTransition } from 'react';
import { fetchDeals } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Star } from 'lucide-react';

export default function MoolyaSetu() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async () => {
    startTransition(async () => {
      const response = await fetchDeals(query);
      if (response.success) setResults(response.data);
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-slate-900 mb-4">Moolya<span className="text-blue-600">Setu</span></h1>
        <p className="text-slate-500 text-xl">The AI-Powered Bridge to Smarter Shopping.</p>
      </div>

      <div className="flex gap-2 max-w-2xl mx-auto mb-16">
        <input 
          className="flex-1 p-4 rounded-2xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products across all platforms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          disabled={isPending}
          className="bg-blue-600 text-white px-8 rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {isPending ? "Analyzing..." : <><Search size={20} /> Compare</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {results.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold">
                Value Score: {item.score}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-black">${item.price}</span>
                <span className="text-sm font-medium text-slate-400">{item.source}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 mb-6">
                <Star size={16} fill="currentColor" /> {item.rating} <span className="text-slate-400 text-xs">({item.reviews})</span>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
                View Deal
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
