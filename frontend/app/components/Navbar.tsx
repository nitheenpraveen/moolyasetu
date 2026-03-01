"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
          MoolyaSetu
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/compare" className="hover:text-blue-400">Compare</Link>
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/alerts" className="hover:text-blue-400">Alerts</Link>
          <Link href="/contact" className="hover:text-blue-400">Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden focus:outline-none"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-gray-800 px-6 py-4 space-y-3">
          <Link href="/" className="block hover:text-blue-400">Home</Link>
          <Link href="/compare" className="block hover:text-blue-400">Compare</Link>
          <Link href="/dashboard" className="block hover:text-blue-400">Dashboard</Link>
          <Link href="/alerts" className="block hover:text-blue-400">Alerts</Link>
          <Link href="/contact" className="block hover:text-blue-400">Contact</Link>
        </div>
      )}
    </nav>
  );
}
