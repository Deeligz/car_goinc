import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car-Go Parts",
  description: "Your one-stop shop for car spare parts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
