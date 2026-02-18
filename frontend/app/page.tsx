export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full opacity-40 blur-3xl animate-blob"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-300 rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-2xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-6xl font-extrabold text-blue-800 mb-6 animate-fadeIn">
          MoolyaSetu
        </h1>
        <p className="text-lg text-gray-700 mb-8 animate-fadeIn delay-200">
          Smart shopping alerts and real-time product comparisons.  
          Find the best deals across India’s top e-commerce websites with reviews and ratings — all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeIn delay-400">
          <a href="/compare" className="bg-blue-600 text-white px-8 py-4 rounded shadow hover:bg-blue-700 transition transform hover:scale-105">
            Compare Products
          </a>
          <a href="/alerts" className="bg-green-600 text-white px-8 py-4 rounded shadow hover:bg-green-700 transition transform hover:scale-105">
            Manage Alerts
          </a>
          <a href="/dashboard" className="bg-purple-600 text-white px-8 py-4 rounded shadow hover:bg-purple-700 transition transform hover:scale-105">
            Dashboard
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Best Deals</h3>
            <p className="text-gray-600 text-sm">
              Instantly find the lowest prices and highest-rated products across multiple marketplaces.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold text-green-700 mb-2">Product Reviews</h3>
            <p className="text-gray-600 text-sm">
              Check real customer ratings and reviews before making your purchase decision.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Price Alerts</h3>
            <p className="text-gray-600 text-sm">
              Set alerts for your favorite products and never miss a price drop again.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(30px,-50px) scale(1.1);}
          66%{transform:translate(-20px,20px) scale(0.9);}
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes fadeIn { 0%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn 1s forwards; }
        .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
        .animate-fadeIn.delay-400 { animation-delay: 0.4s; }
      `}</style>
    </main>
  );
}
