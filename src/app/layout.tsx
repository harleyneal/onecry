import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneCry Pensacola | 24/7/365 Prayer",
  description:
    "Uniting churches across Pensacola for 24/7/365 prayer. Join us in covering our city in night and day prayer throughout Escambia and Santa Rosa Counties.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "OneCry Pensacola | 24/7/365 Prayer",
    description:
      "Uniting churches across Pensacola for 24/7/365 prayer coverage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
