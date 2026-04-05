import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneCry Pensacola | 24/7/365 Prayer",
  description:
    "Uniting churches across Pensacola for 24/7/365 prayer. Join us in covering our city in night and day prayer throughout Escambia and Santa Rosa Counties.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
