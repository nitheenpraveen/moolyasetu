export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-center py-6 mt-8 border-t">
      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-4">
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </div>
      <p className="text-sm">
        © {new Date().getFullYear()} MoolyaSetu. All rights reserved.
      </p>
    </footer>
  );
}