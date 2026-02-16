"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">MoolyaSetu</h1>
      <div className="space-x-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/compare" className="hover:underline">Compare</Link>
        <Link href="/alerts" className="hover:underline">Alerts</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
    </nav>
  );
}