import { Inter } from "next/font/google";
import { CartProvider } from "./cart/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mctaba Shop",
  description: "Your local online store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {" "}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
