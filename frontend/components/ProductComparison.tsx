"use client";

import React from "react";

interface Comparison?: string;
  data?: any;
  error?: string | null;
ComparisonProps {
, production‑ready **final `ProductComparison;
  results: Comparison TailwindCSS, handles Amazon + Flipkart shows eBay data or errors.

---

Result {
  source: string;
  link}

interface Product  product: stringResult[];
}

export default function ProductComparison({ product, results }: ProductComparisonProps) {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        Comparison Results for "{product}"
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Marketplace</th>
              <th className="px-4 py-2 text-left font-semibold">Details</th>
            </tr>
          {results.map((result </thead>
          <tbody>
           , idx) => (
             
                <tr key={idx} className="border-t hover:bg-gray-50"> <td className="px-4 py-3 font-medium">{result.source}</td>
                 
                <td className="px-4 py-3"> {result.link && href={result.link (
                    target="_blank"
                      rel="noopener noreferrer className="text.source}
                    </a>
                  )}

                  result.source === <a
                     }
                     "
                     -blue-600 hover:underline"
                    >
                      View on {result {result.data && "eBay" && (
                    <div className="space-y-2">
                     Summaries?.map((item {result.data.item) => (
                       : any, i: number <div key={i} className="p-2 border rounded">
                          <p className="font-semibold">
                         {item.title}</p> <p className="text-sm text-gray-600">
                            {item.price?.value} {item.price?.currency}
                          <a
                            </p>
                          href={item.item                           WebUrl}
                            target="_blank"
"
                            rel="noopener noreferrer className="text-blue-600 hover:underline text-sm"
                          </a>
                        >
                            View on eBay
                          </div>
                      {result.error &&{result.error}</p> ))}
                    </div>
                  )}

                  (
                    <p className="text-red-600 text-sm">
                  </td>
              )}
                </tr>
           
      </div>

      ))}
          </tbody>
        </table> {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        MoolyaSet are subject to changeu provides deal comparisons      </p>
    </div> using affiliate links and marketplace APIs.
        Prices and availability without notice.

  );
}
