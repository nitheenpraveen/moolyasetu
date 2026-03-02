import { ShieldCheck, Info, Scale } from "lucide-react";

export default function DisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="flex items-center gap-3 mb-6 text-blue-600">
        <ShieldCheck size={32} />
        <h1 className="text-4xl font-black text-slate-900">Affiliate Disclosure</h1>
      </div>

      <div className="prose prose-slate lg:prose-xl">
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          In compliance with the Federal Trade Commission (FTC) guidelines and marketplace policies, 
          <strong> MoolyaSetu</strong> provides this disclosure regarding our relationship with service providers and retailers.
        </p>

        <div className="grid gap-6 mb-12">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Info className="text-blue-500" size={20} /> How We Earn
            </h2>
            <p className="text-slate-600">
              MoolyaSetu is a participant in the Amazon Services LLC Associates Program, Flipkart Affiliate Program, 
              and eBay Partner Network. This means we may earn a small commission when you click on links 
              and make a purchase, at no additional cost to you.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Scale className="text-blue-500" size={20} /> Unbiased Comparisons
            </h2>
            <p className="text-slate-600">
              Our "Smart Value Score" is calculated algorithmically based on price, ratings, and reviews. 
              Our affiliate relationships do not influence which products are ranked as "Best Value." 
              The AI logic remains independent to ensure the best results for the user.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-400 italic text-center">
          Last updated: March 2, 2026
        </p>
      </div>
    </div>
  );
}
