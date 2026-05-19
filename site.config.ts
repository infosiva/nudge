/**
 * site.config.ts — Tutiq site-wide content config
 * All landing page text lives here — no hardcoded JSX strings.
 */

export const siteConfig = {
  siteName: 'Tutiq',
  domain: 'tutiq.app',
  tagline: 'Your Personal AI Tutor',
  headline: 'Get instant homework help from your personal AI tutor',
  subheadline: 'Personalised tutoring for every subject and age. No account needed — 3 free sessions to start.',
  ctaPrimary: 'Start Learning Free',
  ctaSecondary: 'See Pricing',

  seo: {
    title: 'Tutiq — Your Personal AI Tutor',
    description: 'Get instant homework help and personalised tutoring from AI. Works for all subjects and ages.',
    ogImage: '/og-tutiq.png',
  },

  nav: [
    { label: 'Home',     href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Subjects', href: '/#subjects' },
    { label: 'Pricing',  href: '/pricing' },
    { label: 'About',    href: '/about' },
  ],

  features: [
    { icon: '🧠', title: 'Step-by-Step Explanations',  desc: 'AI breaks down any topic into clear, bite-sized steps tailored to your level.' },
    { icon: '📚', title: 'All Subjects Covered',        desc: 'Maths, Science, English, History, Coding, Interview prep and more.' },
    { icon: '⚡', title: 'Instant Answers',             desc: 'No waiting — get a personalised explanation in seconds, any time of day.' },
    { icon: '🎯', title: 'Adaptive Difficulty',         desc: 'AI adjusts explanations to match your age, level and learning pace.' },
    { icon: '📝', title: 'Quiz After Every Topic',      desc: 'Quick quiz after each lesson to cement what you learned.' },
    { icon: '📄', title: 'Study Buddy',                 desc: 'Upload your notes and get instant flashcards, quizzes and summaries.' },
  ],

  pricing: [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      highlight: false,
      features: [
        '3 tutoring sessions / day',
        '3 subjects available',
        'Step-by-step explanations',
        'Quiz after each topic',
      ],
      cta: 'Start Free',
      ctaHref: '/onboard',
    },
    {
      name: 'Pro',
      price: '$8',
      period: '/month',
      highlight: true,
      badge: 'Most popular',
      features: [
        'Unlimited sessions',
        'All subjects unlocked',
        'Progress tracking',
        'PDF study guides',
        'Mock exam mode',
        'Priority AI responses',
      ],
      cta: 'Upgrade to Pro',
      ctaHref: '/pricing',
    },
  ],

  trustPills: [
    '✓ No account needed',
    '✓ 3 free sessions',
    '✓ All subjects',
    '✓ All ages',
  ],

  chatbot: {
    welcomeMessage: 'Hi! What subject would you like help with today?',
    botName: 'Tutiq AI',
    placeholder: 'Ask me anything…',
  },
} as const
