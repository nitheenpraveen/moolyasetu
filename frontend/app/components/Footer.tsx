import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="text-2xl font-black text-slate-900">
            Moolya<span className="text-blue-600">Setu</span>
          </span>
        </div>
        
        <div className="flex justify-center gap-8 mb-8 text-sm font-medium text-slate-500">
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/disclosure" className="hover:text-blue-600 transition-colors">Disclosure</Link>
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
        </div>

        <p className="max-w-3xl mx-auto text-xs text-slate-400 leading-relaxed">
          Disclaimer: Product prices and availability are accurate as of the date/time indicated and are subject to change. 
          Any price and availability information displayed on the relevant merchant site at the time of purchase will apply 
          to the purchase of this product.
        </p>
      </div>
    </footer>
  );
}
