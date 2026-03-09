"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            MoolyaSetu
          </Link>

          {/* Navigation */}
          <div className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>

            <Link href="/compare" className="text-gray-700 hover:text-blue-600">
              Compare
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
}