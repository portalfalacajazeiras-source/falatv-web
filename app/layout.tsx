import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { BottomNav } from '@/components/layout/BottomNav'
import './globals.css'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'FalaTV'
const CHANNEL_NAME = process.env.NEXT_PUBLIC_CHANNEL_NAME ?? 'Fala Cajazeiras'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://falatv.com.br'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${CHANNEL_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Portal de vídeos do canal ${CHANNEL_NAME}. Assista notícias, lives e conteúdo local de Cajazeiras e região.`,
  keywords: ['Cajazeiras', 'notícias', 'vídeos', 'Paraíba', 'FalaTV', 'Fala Cajazeiras'],
  authors: [{ name: CHANNEL_NAME, url: SITE_URL }],
  creator: CHANNEL_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${CHANNEL_NAME}`,
    description: `Portal de vídeos do canal ${CHANNEL_NAME}.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${CHANNEL_NAME}`,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
