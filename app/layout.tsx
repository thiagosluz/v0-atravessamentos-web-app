import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Atravessamentos — Coletivo de educação, arte e justiça social",
  description:
    "Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação. Coletivo nascido em Jataí-GO atuando entre educação, arte, decolonialidade e movimentos feminista e LGBTQIAPN+.",
  generator: "v0.app",
  keywords: [
    "Atravessamentos",
    "Jataí",
    "coletivo",
    "educação",
    "arte",
    "decolonialidade",
    "feminismo",
    "LGBTQIAPN+",
    "cultura afro-brasileira",
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0e9d8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1714" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
