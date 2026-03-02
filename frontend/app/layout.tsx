import { Footer } from "@/components/Footer";
// ... (other imports)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
