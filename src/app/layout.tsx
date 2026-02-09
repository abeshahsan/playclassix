import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/global/theme-provider";
import { AppShell } from "@/components/global/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://playclassix.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "PlayClassix — Classic Online Games for Everyone",
    template: "%s | PlayClassix",
  },
  description:
    "Play a variety of classic games online with friends and players around the world. Enjoy Memory Match, Tic Tac Toe, Snake, and more — free in your browser.",
  keywords: [
    "online games",
    "classic games",
    "memory match",
    "tic tac toe",
    "snake",
    "multiplayer",
    "browser games",
    "playclassix",
  ],
  authors: [{ name: "PlayClassix" }],
  creator: "PlayClassix",
  metadataBase: new URL(siteUrl),

  /* ── Favicons & Browser Icons ──────────────────────────── */
  icons: {
    icon: [
      { url: "/assets/favicon.ico", sizes: "48x48" },
      { url: "/assets/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/assets/safari-pinned-tab.svg",
        color: "#6C5CE7",
      },
    ],
  },

  manifest: "/manifest.json?v=1.0",

  /* ── Open Graph ────────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PlayClassix",
    title: "PlayClassix — Classic Online Games for Everyone",
    description:
      "Play a variety of classic games online with friends and players around the world.",
    images: [
      {
        url: "/assets/social/og-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: "PlayClassix — Classic Online Games",
      },
    ],
  },

  /* ── Twitter Card ──────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "PlayClassix — Classic Online Games for Everyone",
    description:
      "Play a variety of classic games online with friends. Free in your browser.",
    images: ["/assets/social/twitter-image-1200x675.png"],
  },

  /* ── Microsoft Tile ────────────────────────────────────── */
  other: {
    "msapplication-TileImage": "/assets/mstile-150x150.png",
    "msapplication-TileColor": "#6C5CE7",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AppShell>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
