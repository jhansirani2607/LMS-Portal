import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVM Smart Solutions — Intelligent Digital Experiences",
  description:
    "AVM Smart Solutions builds intelligent digital experiences — modern web, mobile, cloud & custom software — while shaping the next generation of software talent through training, internships and live projects.",
  keywords: [
    "AVM Smart Solutions",
    "software development",
    "web development",
    "mobile app development",
    "cloud solutions",
    "IT training",
    "internships",
    "live projects",
    "MERN stack",
    "AI ML courses",
  ],
  authors: [{ name: "AVM Smart Solutions" }],
  icons: {
    icon: "/images/avm-logo.svg",
  },
  openGraph: {
    title: "AVM Smart Solutions — Intelligent Digital Experiences",
    description:
      "End-to-end software development services plus industry-aligned training, internships, and live projects.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVM Smart Solutions",
    description: "Intelligent digital experiences & software talent development.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
