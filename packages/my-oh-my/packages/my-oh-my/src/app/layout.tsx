import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Oh My - XAVA Token Dashboard",
  description: "Real-time XAVA token data dashboard with beautiful charts and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
