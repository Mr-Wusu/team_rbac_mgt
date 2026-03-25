import type { Metadata } from "next";
import "./globals.css";
import Header from "./component/layout/Header";

export const metadata: Metadata = {
  title: "Team Access Control",
  description:
    "Role-based access control system built with Next.js 16 and React 19",
  keywords: ["Team", "Access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
