import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 768, 1280],
    minimumCacheTTL: 3600,
  },

  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache agressivo para assets estáticos
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // Compressão e otimizações
  compress: true,
  poweredByHeader: false,

  // Variáveis de ambiente expostas ao cliente
  env: {
    NEXT_PUBLIC_WP_API_URL: process.env.NEXT_PUBLIC_WP_API_URL ?? '',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? 'FalaTV',
    NEXT_PUBLIC_CHANNEL_NAME: process.env.NEXT_PUBLIC_CHANNEL_NAME ?? 'Fala Cajazeiras',
  },
}

export default nextConfig
