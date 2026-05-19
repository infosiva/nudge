import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })
import Script from 'next/script'
import './globals.css'
import config from '@/vertical.config'
import { getMeshStyle, getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import PageTracker from '@/components/PageTracker'
import Navbar from '@/components/Navbar'
import FooterExtras from '@/components/FooterExtras'
import ChatBot from '@/components/ChatBot'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title:        'Tutiq — Your Personal AI Tutor',
  description:  'Get instant homework help and personalised tutoring from AI. Works for all subjects and ages.',
  keywords:     config.keywords,
  metadataBase: new URL('https://tutiq.app'),
  alternates:   { canonical: '/' },
  openGraph: {
    title:       'Tutiq — Your Personal AI Tutor',
    description: 'Get instant homework help and personalised tutoring from AI. Works for all subjects and ages.',
    url:         'https://tutiq.app',
    siteName:    'Tutiq',
    type:        'website',
    locale:      'en_GB',
    images: [{ url: `/opengraph-image`, width: 1200, height: 630, alt: `Tutiq — Your Personal AI Tutor` }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tutiq — Your Personal AI Tutor',
    description: 'Get instant homework help and personalised tutoring from AI. Works for all subjects and ages.',
    images:      [`https://tutiq.app/opengraph-image`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// Derive CSS custom properties from vertical theme at build time
const colors   = COLOR_MAP[config.themeColor] ?? COLOR_MAP['violet']
const meshStyle = getMeshStyle(config.themeColor)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full"
      style={{
        '--theme-primary':   colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-base':      colors.base,
        '--scrollbar-color': getScrollbarColor(config.themeColor),
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${jakarta.variable} min-h-full flex flex-col text-white`}
        style={{ background: colors.base, fontFamily: 'var(--font-body, system-ui)' }}
      >
        {/* Dynamic mesh gradient bg — changes per vertical */}
        <div style={meshStyle} />
        {/* Animated blob overlays */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="mesh-blob1" style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob2" style={{ position: 'absolute', top: '30%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}44 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob3" style={{ position: 'absolute', bottom: '-15%', left: '40%', width: 550, height: 550, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}38 0%, transparent 65%)`, filter: 'blur(50px)' }} />
        </div>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <PageTracker site='nudge' />
        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        <ChatBot />
        <FeedbackWidget siteName="Tutiq" accentColor="#10b981" accentColor2="#34d399" />

        <FooterExtras />
        <Footer siteName={config.name} />
      <CookieConsent />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Tutiq',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Get instant homework help and personalised tutoring from AI. Works for all subjects and ages.',
            url: 'https://tutiq.app',
          })}}
        />
        <Script async src="http://31.97.56.148:3100/script.js" data-website-id="7ef81f7e-0740-4833-a017-5fe761072d37" strategy="afterInteractive" />
      </body>
    </html>
  )
}
