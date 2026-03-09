"use client";

type Product = {
  title: string;
  price: number;
  image: string;
  link: string;
  source: string;
};

export default function ProductCard({ product }: { product: Product }) {

  const safeLinkId = Buffer.from(product.link).toString("base64");

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-2" />

      <h3 className="font-semibold text-sm mb-1">{product.title}</h3>

      <p className="text-green-600 font-bold mb-2">₹{product.price}</p>

      <a
        href={`/go/${safeLinkId}`}
        target="_blank"
        rel="nofollow noreferrer"
        className="btn-primary"
      >
        View on {product.source}
      </a>
    </div>
  );
}