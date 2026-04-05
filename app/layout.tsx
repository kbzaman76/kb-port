import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Software Engineer Story Portfolio",
  description: "Dark-mode storytelling portfolio template with scroll animation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
