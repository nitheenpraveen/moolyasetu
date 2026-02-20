export async function searchFlipkart(query: string) {
  return [
    {
      id: "fk1",
      title: `Mock Flipkart result for ${query}`,
      price: 69999,
      platform: "Flipkart",
      image: "https://via.placeholder.com/150",
      url: "#"
    }
  ];
}