import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  metadataBase: new URL('https://atravessamentos.com.br'),
  title: {
    default: "Atravessamentos — Coletivo de educação, arte e justiça social",
    template: "%s | Atravessamentos"
  },
  description:
    "Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação. Coletivo nascido em Jataí-GO atuando entre educação, arte, decolonialidade e movimentos feminista e LGBTQIAPN+.",
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
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://atravessamentos.com.br',
    siteName: 'Atravessamentos',
    title: 'Atravessamentos — Coletivo de educação, arte e justiça social',
    description: 'Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação em Jataí-GO.',
    images: [
      {
        url: '/og-image.jpg', // Imagem padrão (precisa existir na pasta public)
        width: 1200,
        height: 630,
        alt: 'Atravessamentos Coletivo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atravessamentos — Coletivo',
    description: 'Corpo coletivo que escuta, sonha e age.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
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
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
