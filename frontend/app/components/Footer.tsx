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
        <p className="text-sm">
          © {new Date().getFullYear()} MoolyaSetu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
