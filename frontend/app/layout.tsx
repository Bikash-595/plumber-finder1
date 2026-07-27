import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAuthProvider } from "@/components/auth/GoogleAuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com"),
  title: {
    default: "Plumber Finder - Find Trusted Plumbers Near You",
    template: "%s | Plumber Finder",
  },
  description: "Compare verified local plumbers, read reviews, and book with confidence.",
  applicationName: "Plumber Finder",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Plumber Finder",
    title: "Plumber Finder - Find Trusted Plumbers Near You",
    description: "Compare verified local plumbers, read reviews, and book with confidence.",
    url: "/",
    images: [{ url: "/Plumber.png", width: 1200, height: 630, alt: "Plumber Finder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumber Finder - Find Trusted Plumbers Near You",
    description: "Compare verified local plumbers, read reviews, and book with confidence.",
    images: ["/Plumber.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-800" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <GoogleAuthProvider>{children}</GoogleAuthProvider>
      </body>
    </html>
  );
}
