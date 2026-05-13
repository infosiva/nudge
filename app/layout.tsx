import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import config from '@/vertical.config'
import { getMeshStyle, getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import Navbar from '@/components/Navbar'
import FooterExtras from '@/components/FooterExtras'
import ChatBot from '@/components/ChatBot'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       config.metaTitle,
  description: 'Discover Nudge, the AI-powered learning platform that adapts to your age and level. Learn new skills and subjects with personalized paths and quizzes.',
  keywords:    config.keywords,
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
        // CSS vars consumed by globals.css animations and scrollbar
        '--theme-primary':   colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-base':      colors.base,
        '--scrollbar-color': getScrollbarColor(config.themeColor),
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-full flex flex-col text-white`}
        style={{ background: colors.base }}
      >
        {/* Dynamic mesh gradient bg — changes per vertical */}
        <div style={meshStyle} />
        {/* Animated blob overlays */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="mesh-blob1" style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}22 0%, transparent 65%)`, filter: 'blur(40px)' }} />
          <div className="mesh-blob2" style={{ position: 'absolute', top: '30%', right: '-15%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}18 0%, transparent 65%)`, filter: 'blur(40px)' }} />
          <div className="mesh-blob3" style={{ position: 'absolute', bottom: '-15%', left: '40%', width: 450, height: 450, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 65%)`, filter: 'blur(40px)' }} />
        </div>

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
      </body>
    </html>
  )
}
