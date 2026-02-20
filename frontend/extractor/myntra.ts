export async function searchMyntra(query: string) {
  return [
    {
      id: "mn1",
      title: `Mock Myntra result for ${query}`,
      price: 70999,
      platform: "Myntra",
      image: "https://via.placeholder.com/150",
      url: "#"
    }
  ];
}