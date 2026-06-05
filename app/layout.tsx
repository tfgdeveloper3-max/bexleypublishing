import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Idea",
  description: "A LoungeLizard Design",
};

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700", "800", "900"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>{children}</body>
    </html>
  );
}

