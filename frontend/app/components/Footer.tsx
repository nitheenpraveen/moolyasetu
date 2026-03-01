"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
        
        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-6 mb-4 sm:mb-0">
          <a href="/privacy" className="hover:text-blue-400">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-400">Terms of Service</a>
          <a href="/contact" className="hover:text-blue-400">Contact</a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} MoolyaSetu. All rights reserved.
        </p>
      </div>

      {/* Disclaimers */}
      <div className="max-w-7xl mx-auto px-6 pb-6 text-center text-xs text-gray-400 space-y-2">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <p>Flipkart and eBay links are provided for comparison purposes. Prices and availability are subject to change without notice.</p>
        <p>MoolyaSetu provides deal comparisons using affiliate links and marketplace APIs. We do not guarantee accuracy of third‑party data.</p>
      </div>
    </footer>
  );
}
