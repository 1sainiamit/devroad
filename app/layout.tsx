import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://devroad-wheat.vercel.app"),
  title: {
    default: "Devroad | Sell Digital Products",
    template: "%s | Devroad",
  },
  description: "A premium platform for creators, developers, and designers to sell digital products, courses, and software seamlessly.",
  keywords: ["digital products", "creators", "sell online", "courses", "software", "ecommerce", "digital downloads"],
  authors: [{ name: "Devroad" }],
  creator: "Devroad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Devroad | Sell Digital Products",
    description: "A premium platform for creators, developers, and designers to sell digital products, courses, and software seamlessly.",
    siteName: "Devroad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devroad | Sell Digital Products",
    description: "A premium platform for creators, developers, and designers to sell digital products, courses, and software seamlessly.",
  },
};

import { getCurrentUser } from "@/lib/session";
import { AuthStoreProvider } from "@/store/useAuthStore";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col">
        <AuthStoreProvider user={user}>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </AuthStoreProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-J7K962GWZ3"} />
      </body>
    </html>
  );
}
