import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scaler BDA Agent",
  description: "AI-powered sales assistant for Scaler BDAs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
