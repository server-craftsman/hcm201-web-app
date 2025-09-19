import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import { AppProviders, MainLayout } from '@/shared'
import '@/styles/index.css'
import icon from '@/shared/assets/images/icon.jpg'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
})

export async function generateMetadata(): Promise<Metadata> {
  let metadataBase: URL | undefined
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? ''
    const proto = h.get('x-forwarded-proto') ?? 'https'
    if (host) metadataBase = new URL(`${proto}://${host}`)
  } catch { }
  if (!metadataBase && process.env.NEXT_PUBLIC_BASE_URL && /^https?:\/\//i.test(process.env.NEXT_PUBLIC_BASE_URL)) {
    try { metadataBase = new URL(process.env.NEXT_PUBLIC_BASE_URL) } catch { }
  }
  return {
    metadataBase,
    title: {
      default: 'Tranh luận Tư tưởng Hồ Chí Minh',
      template: '%s | Tranh luận Tư tưởng Hồ Chí Minh'
    },
    description: 'Nền tảng thảo luận và học tập về Tư tưởng Hồ Chí Minh cho sinh viên',
    keywords: [
      'Hồ Chí Minh',
      'tư tưởng',
      'tranh luận',
      'thảo luận',
      'học tập',
      'sinh viên',
      'triết học',
      'chính trị',
      'Việt Nam'
    ],
    authors: [{ name: 'HCM201 Team' }],
    creator: 'HCM201 Team',
    publisher: 'HCM201 Team',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      siteName: 'Tranh luận Tư tưởng Hồ Chí Minh',
      title: 'Tranh luận Tư tưởng Hồ Chí Minh',
      description: 'Nền tảng thảo luận và học tập về Tư tưởng Hồ Chí Minh cho sinh viên',
      images: [
        { url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Tranh luận Tư tưởng Hồ Chí Minh' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hcm201debate',
      creator: '@hcm201debate',
      title: 'Tranh luận Tư tưởng Hồ Chí Minh',
      description: 'Nền tảng thảo luận và học tập về Tư tưởng Hồ Chí Minh cho sinh viên',
      images: ['/images/og-image.jpg'],
    },
    icons: [
      { url: icon.src, sizes: '32x32', type: 'image/jpeg' },
      { url: icon.src, sizes: '16x16', type: 'image/jpeg' },
      { url: icon.src, sizes: '180x180', type: 'image/jpeg', rel: 'apple-touch-icon' },
    ],
    manifest: '/site.webmanifest',
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased vietnamese-spacing" suppressHydrationWarning={true}>
        <AppProviders>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProviders>
      </body>
    </html>
  )
}