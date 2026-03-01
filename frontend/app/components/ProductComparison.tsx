"use client";

import React from "react";

interface ComparisonResult {
  source: string;
  link?: string;
  data?: any;
  error?: string;
}

interface Props {
  product: string;
  results: ComparisonResult[];
}

export default function ProductComparison({ product, results }: Props) {
  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Best Deals for {product}
      </h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Marketplace
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Deal / Link
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Price / Info
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">
                  {result.source}
                </td>
                <td className="py-3 px-4">
                  {result.link ? (
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on {result.source}
                    </a>
                  ) : result.error ? (
                    <span className="text-red-500">{result.error}</span>
                  ) : (
                    <span className="text-gray-500">No link available</span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {result.data?.itemSummaries ? (
                    <div className="space-y-2">
                      {result.data.itemSummaries.slice(0, 3).map((item: any, i: number) => (
                        <div key={i}>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            {item.price?.value} {item.price?.currency}
                          </p>
                          <a
                            href={item.itemWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View on eBay
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Prices and availability are subject to change without notice. Affiliate links may earn commissions.
      </p>
    </div>
  );
}
