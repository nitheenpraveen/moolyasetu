// Before the return statement:
// We scramble the product link so it looks like '/go/aHR0cHM6...'
const safeLinkId = Buffer.from(product.link).toString('base64');

return (
  <a 
    href={`/go/${safeLinkId}`} 
    target="_blank" 
    rel="nofollow noreferrer"
    className="btn-primary"
  >
    View on {product.source}
  </a>
);
