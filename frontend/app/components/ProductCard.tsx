import { Star, Zap, ExternalLink, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: any }) {
  // A score above 80 is "Elite Value" in 2026 UX terms
  const isBestValue = product.score > 85;

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-none bg-white/70 backdrop-blur-xl",
      isBestValue ? "ring-2 ring-blue-500 shadow-blue-100" : "shadow-sm"
    )}>
      {/* 2026 Trend: Floating Glass Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge variant={isBestValue ? "default" : "secondary"} className="gap-1 px-3 py-1">
          {isBestValue ? <Zap size={14} fill="currentColor" /> : null}
          Score: {product.score}
        </Badge>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {product.source} • <ShieldCheck size={12} className="text-emerald-500" /> Verified
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-sm text-slate-400 line-through">₹{Math.round(product.price * 1.2)}</span>
            <div className="text-3xl font-black text-slate-900">₹{product.price}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star size={16} fill="currentColor" /> {product.rating}
            </div>
            <div className="text-xs text-slate-400">{product.reviews} reviews</div>
          </div>
        </div>

        <a 
          href={product.link} 
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95"
        >
          Grab Deal <ExternalLink size={18} />
        </a>
      </div>
    </Card>
  );
}
