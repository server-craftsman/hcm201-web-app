import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders, MainLayout } from '@/shared'
import '@/styles/index.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
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
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tranh luận Tư tưởng Hồ Chí Minh',
      },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
      <body className="antialiased vietnamese-spacing">
        <AppProviders>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProviders>
      </body>
    </html>
  )
}