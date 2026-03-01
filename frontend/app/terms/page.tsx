"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        By using <span className="font-semibold">MoolyaSetu</span>, you agree to the 
        following terms and conditions.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Use of Service</h2>
      <p className="text-gray-700 mb-4">
        MoolyaSetu provides product comparison links and deal information from 
        Amazon, Flipkart, and eBay. We do not sell products directly. All purchases 
        are made on third‑party marketplaces.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Affiliate Disclosure</h2>
      <p className="text-gray-700 mb-4">
        As an Amazon Associate, we earn from qualifying purchases. Flipkart and eBay 
        links are provided for comparison purposes. Prices and availability are subject 
        to change without notice.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Limitations</h2>
      <p className="text-gray-700 mb-4">
        We strive to provide accurate deal information, but we cannot guarantee 
        completeness or accuracy of third‑party data. Users are responsible for 
        verifying product details before purchase.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Changes to Terms</h2>
      <p className="text-gray-700 mb-4">
        We may update these Terms of Service as our platform evolves. Continued use 
        of MoolyaSetu after changes indicates acceptance of the updated terms.
      </p>
      <p className="text-sm text-gray-500 mt-8 text-center">
        Last updated: March 2026
      </p>
    </div>
  );
}
