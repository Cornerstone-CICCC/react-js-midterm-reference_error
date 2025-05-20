import { Header } from "@/components/shared/Header";
import "../globals.css";

import { Footer } from "@/components/shared/Footer";
import { MobileNavigation } from "@/components/shared/MobileNavigation";
import { AuthProvider } from "@/contexts/auth";
import { isTokenExpired } from "@/utils/token";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Monogatari",
  description: "A marketplace for everyone",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await headers(); // headersを使用するために呼び出す
  const accessToken = header
    .get("cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("accessToken="))
    ?.split("=")[1];

  const isAuthenticated = !!accessToken && !isTokenExpired(accessToken);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AuthProvider>
            <Header isSignedIn={isAuthenticated} />
            {children}
            <Footer />
            <MobileNavigation />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
