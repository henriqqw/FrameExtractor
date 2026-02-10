import '@/styles/globals.css'
import '@/styles/light-theme.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EasyWebp Converter - Convert Images to WebP Online',
  description: 'Convert your images to WebP format easily and efficiently with a beautiful macOS-inspired dark theme. Fast, secure, and runs entirely in your browser. Made with ❤️ by chaostec',
  keywords: 'webp converter, image converter, jpg to webp, png to webp, online converter, free webp converter',
  authors: [{ name: 'chaostec' }],
  creator: 'chaostec',
  publisher: 'chaostec',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EasyWebp Converter - Convert Images to WebP Online',
    description: 'Convert your images to WebP format easily and efficiently with a beautiful macOS-inspired dark theme. Made with ❤️ by chaostec',
    url: '/',
    siteName: 'EasyWebp Converter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EasyWebp Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasyWebp Converter - Convert Images to WebP Online',
    description: 'Convert your images to WebP format easily and efficiently with a beautiful macOS-inspired dark theme. Made with ❤️ by chaostec',
    creator: '@chaosphory',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}