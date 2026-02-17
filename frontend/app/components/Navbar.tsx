"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link href="/">MoolyaSetu</Link>
      </div>
      <div className="space-x-6">
        <Link href="/compare" className="hover:text-blue-400">
          Compare
        </Link>
        <Link href="/alerts" className="hover:text-blue-400">
          Alerts
        </Link>
        <Link href="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
