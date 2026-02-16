export default function Terms() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        Effective Date: [Insert Date]
      </p>
      <p className="text-gray-700 mb-4">
        By using MoolyaSetu, you agree to the following terms:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Service</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>No account or registration is required.</li>
        <li>If you opt-in to alerts, you agree to provide accurate contact information.</li>
        <li>You agree not to misuse the service (e.g., scraping, hacking, fraudulent activity).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Alerts & Comparisons</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Product data is provided “as-is” and may come from third-party sources.</li>
        <li>We do not guarantee accuracy, availability, or pricing of products.</li>
        <li>Alerts are provided as a convenience and may not reflect real-time changes.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
      <p className="text-gray-700 mb-4">
        We are not liable for losses resulting from reliance on product data or service interruptions.
        Maximum liability is limited to the amount you paid for the service (if any).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-gray-700">
        For questions, email: <strong>support@moolyasetu.com</strong>
      </p>
    </main>
  );
}