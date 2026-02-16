export default function Privacy() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        Effective Date: [Insert Date]
      </p>
      <p className="text-gray-700 mb-4">
        MoolyaSetu (“we”, “our”, “us”) respects your privacy. This Privacy Policy
        explains how we handle information when you use our shopping alerts and
        comparison services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>No accounts required — you can use MoolyaSetu without registering.</li>
        <li>Optional alerts — if you opt-in, we may collect your email or contact details to deliver alerts.</li>
        <li>Usage data — non-personal info like pages visited, search queries, and device/browser type.</li>
        <li>Cookies & analytics — used to improve performance and user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Unsubscribe from alerts anytime.</li>
        <li>Disable cookies in your browser.</li>
        <li>Request deletion of any data you provided.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-gray-700">
        For privacy concerns, email: <strong>privacy@moolyasetu.com</strong>
      </p>
    </main>
  );
}
