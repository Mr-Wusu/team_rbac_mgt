import type { Metadata } from "next";
import "./globals.css";
import Header from "./_component/layout/Header";
import AuthProvider from "./provider/authProvider";


export const metadata: Metadata = {
  title: "Team Access Control",
  description:
    "Role-based access control system built with Next.js 16 and React 19",
  keywords: ["Team", "Access control"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <AuthProvider>
        <body className="min-h-screen bg-slate-950 text-slate-100 grid place-content-center">
          <Header />
          <main className="pt-18">{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
}
