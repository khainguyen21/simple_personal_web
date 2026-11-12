import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/site";
import "./globals.css";

// Body text: a clean grotesk with a little more character than the usual defaults.
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Name and page titles.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// On Vercel this is your production domain; locally it falls back to localhost.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.description,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: profile.name,
    description: profile.description,
    images: ["/khai-portrait.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#121610" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the script below may add data-theme before React hydrates.
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved light/dark choice before the first paint, so it never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      {/* Extensions like Grammarly add attributes to <body>; don't flag that as a mismatch. */}
      <body suppressHydrationWarning>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
