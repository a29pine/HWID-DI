import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HWID-DI | a29pine.xyz",
  description: "Comprehensive Device Information Service",
  generator: 'HWID'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="Comprehensive Device Information Service" />
        <meta name="keywords" content="device information, browser information, network information, WiFi speed test, privacy-focused" />
        <meta name="author" content="a29pine" />
        <meta property="og:title" content="HWID-DI | a29pine.xyz" />
        <meta property="og:description" content="Comprehensive Device Information Service" />
        <meta property="og:url" content="https://a29pine.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://a29pine.xyz/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HWID-DI | a29pine.xyz" />
        <meta name="twitter:description" content="Comprehensive Device Information Service" />
        <meta name="twitter:image" content="https://a29pine.xyz/twitter-image.jpg" />
        <link rel="canonical" href="https://a29pine.xyz" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}