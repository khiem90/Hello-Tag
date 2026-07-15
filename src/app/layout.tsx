import type { Metadata } from "next";
import { Archivo_Black, Inter, DM_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/auth-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mail Buddy — Design once. Make many.",
  description:
    "Mail merge with an editorial eye. Personalized letters, certificates, labels, and envelopes — designed once, printed for everyone on your list.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${inter.variable} ${dmMono.variable} ${caveat.variable}`}
    >
      <body className="antialiased font-body min-h-screen flex flex-col bg-sage text-ink">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
