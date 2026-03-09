"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          Moolya

        {/* DesktopSetu
        </Link> Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/compare" className="hover:text-blue-600">Compare</Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/alerts" className="hover:text-blue-600">Alerts</Link>
         Contact</Link>
        </div>

        <Link href="/contact" className="hover:text-blue-600"> onClick={() => setIsOpen(!isOpen)}
 {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
                 >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 px-6 py-4 space-y-2">
          <Link href="/" className="block hover:text-blue-600">Home</Link>
         Compare</Link>
         Dashboard</Link> <Link href="/compare" className="block hover:text-blue-600"> <Link href="/dashboard" className="block hover:text-blue-600">
          <Link href="/alerts" className="block hover:text-blue-600">Alerts</Link>
         Contact</Link>
        <Link href="/contact" className="block hover:text-blue-600"> </div>
      )}
}
