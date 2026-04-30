'use client'

/**
 * Nexus Email Analytics - Landing Page
 *
 * A complete demo of Darkforge patterns composed into a real SaaS landing page.
 * Showcases: Hero (neon mesh), bento features, testimonial marquee, three-tier
 * pricing, full-width gradient CTA, and 4-column footer with newsletter.
 *
 * VERIFY: Darkforge references were authored from training data (no live docs).
 *   Validate framer-motion 11.x imports and Tailwind v4 arbitrary-value syntax
 *   against current docs before shipping in production.
 *
 * Drop-in: copy this file to app/landing/page.tsx in a Next.js App Router app.
 * Required peer deps: next, react, framer-motion (^11), tailwindcss (^3.4 or ^4).
 * Required tokens: paste the :root block from skills/forge/references/00-dark-tokens.md
 *   into your globals.css before this page will render correctly.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

// ============================================================================
//   TYPES
// ============================================================================

interface NavLink {
  label: string
  href: string
}

interface BentoTile {
  id: string
  title: string
  description: string
  span: 'hero' | 'small' | 'wide'
  accent: 'violet' | 'cyan' | 'pink' | 'green'
  icon: React.ReactNode
}

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  quote: string
}

interface PricingTier {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

type AccentKey = 'violet' | 'cyan' | 'pink' | 'green'

// ============================================================================
//   DATA
// ============================================================================

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
]

const ACCENT_MAP: Record<AccentKey, { color: string; soft: string; glow: string; border: string }> = {
  violet: {
    color: 'var(--df-neon-violet)',
    soft: 'rgba(167,139,250,0.14)',
    glow: 'var(--df-glow-violet)',
    border: 'rgba(167,139,250,0.4)',
  },
  cyan: {
    color: 'var(--df-neon-cyan)',
    soft: 'rgba(34,211,238,0.14)',
    glow: 'var(--df-glow-cyan)',
    border: 'rgba(34,211,238,0.4)',
  },
  pink: {
    color: 'var(--df-neon-pink)',
    soft: 'rgba(244,114,182,0.14)',
    glow: 'var(--df-glow-pink)',
    border: 'rgba(244,114,182,0.4)',
  },
  green: {
    color: 'var(--df-neon-green)',
    soft: 'rgba(74,222,128,0.14)',
    glow: 'var(--df-glow-green)',
    border: 'rgba(74,222,128,0.4)',
  },
}

const BENTO_TILES: BentoTile[] = [
  {
    id: 'inbox-placement',
    title: 'Inbox-placement intelligence',
    description:
      'Real-time scoring across 47 deliverability signals - SPF, DKIM, content tone, link reputation, sender history. Watch your inbox-rate climb in real time, not at the end of the quarter.',
    span: 'hero',
    accent: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M3 7l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'subject-ai',
    title: 'AI-written subject lines',
    description: '8 variants per send, A/B/n routes auto-pick the winner.',
    span: 'small',
    accent: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'cohort-analytics',
    title: 'Cohort-level analytics',
    description: 'Drill from campaign to sequence to variant in two clicks.',
    span: 'small',
    accent: 'pink',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M3 3v18h18M7 14l3-3 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'warmup-network',
    title: 'Warmup network',
    description: 'Reputation grown across 12K real human inboxes, on autopilot.',
    span: 'small',
    accent: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 22s-8-4.5-8-11.5a5.5 5.5 0 0 1 10-3.2 5.5 5.5 0 0 1 10 3.2C22 17.5 12 22 12 22z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'unified-inbox',
    title: 'Unified reply inbox',
    description: 'Every reply, every domain, one keyboard-driven inbox.',
    span: 'small',
    accent: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'crm-sync',
    title: 'Two-way CRM sync - HubSpot, Salesforce, Pipedrive, Close',
    description:
      'Pushes every reply, opportunity, and meeting back to your source of truth in under 90 seconds. No middleware, no Zapier tax.',
    span: 'wide',
    accent: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Chen',
    role: 'Head of Growth',
    company: 'Mercury',
    avatar: 'https://i.pravatar.cc/160?img=47',
    quote:
      'We replaced four tools with Nexus. Inbox placement jumped from 71% to 94% in three weeks - my CFO finally stopped asking why we paid for warmup separately.',
  },
  {
    id: 't2',
    name: 'Marcus Okonkwo',
    role: 'Director of RevOps',
    company: 'Ramp',
    avatar: 'https://i.pravatar.cc/160?img=12',
    quote:
      'The cohort analytics finally let us prove sequence ROI to the board. We cut three under-performing campaigns and reallocated 40% of spend in a single quarter.',
  },
  {
    id: 't3',
    name: 'Priya Raghavan',
    role: 'Founder',
    company: 'Lattice Labs',
    avatar: 'https://i.pravatar.cc/160?img=45',
    quote:
      'AI subject lines are the unlock. Our open rate doubled the day we turned A/B/n on. The fact that it auto-routes to the winner means we never run a stale variant again.',
  },
  {
    id: 't4',
    name: 'Jonas Weber',
    role: 'CMO',
    company: 'Reflect.app',
    avatar: 'https://i.pravatar.cc/160?img=33',
    quote:
      'Migration was four hours. Our entire 60K-contact pipeline was running by lunch. The white-glove team did the DNS records for us - even on the free trial.',
  },
  {
    id: 't5',
    name: 'Ana Lima',
    role: 'Growth Engineer',
    company: 'Cal.com',
    avatar: 'https://i.pravatar.cc/160?img=20',
    quote:
      'Two-way HubSpot sync that actually works. Replies show up in our CRM in under 60 seconds, tagged with sentiment. We deleted three Zapier workflows.',
  },
  {
    id: 't6',
    name: 'Diego Alvarez',
    role: 'VP Sales',
    company: 'Plaid',
    avatar: 'https://i.pravatar.cc/160?img=15',
    quote:
      'The unibox is genuinely keyboard-first. My SDRs cleared 800 replies on a Friday afternoon - that used to be a Monday-morning project. Real productivity gain.',
  },
]

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Validate your first campaign, no credit card required.',
    features: [
      'Up to 1,000 contacts',
      '500 emails / month',
      '1 connected mailbox',
      'Basic deliverability tracker',
      'Community support',
    ],
    cta: 'Start free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'per month',
    description: 'For founders and growth teams scaling outbound.',
    features: [
      'Up to 25,000 contacts',
      'Unlimited emails',
      '10 connected mailboxes',
      'AI subject lines + A/B/n testing',
      '12K-inbox warmup network',
      'Cohort analytics + CSV exports',
      'Priority support (12h SLA)',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249,
    period: 'per month',
    description: 'Custom volume, SSO, and a dedicated success manager.',
    features: [
      'Unlimited contacts + mailboxes',
      'SAML SSO + SCIM provisioning',
      'Custom send infrastructure',
      'Audit logs + compliance pack',
      'Two-way CRM sync (all platforms)',
      'Dedicated CSM + onboarding',
      '99.9% uptime SLA',
    ],
    cta: 'Talk to sales',
  },
]

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Customers', href: '/customers' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press kit', href: '/press' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API reference', href: '/docs/api' },
      { label: 'Deliverability guide', href: '/guides/deliverability' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
]

// ============================================================================
//   NAV BAR
// ============================================================================

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: scrolled ? 'var(--df-glass-bg-md)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--df-border-subtle)' : '1px solid transparent',
        transition:
          'background var(--df-duration-base) var(--df-ease-out), border-color var(--df-duration-base) var(--df-ease-out), backdrop-filter var(--df-duration-base) var(--df-ease-out)',
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between"
        style={{ padding: '14px clamp(16px, 4vw, 32px)' }}
      >
        {/* Brand */}
        <a
          href="/"
          aria-label="Nexus Email Analytics home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--df-text-primary)',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.01em',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--df-radius-md)',
              background:
                'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
              boxShadow: 'var(--df-glow-violet)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--df-text-inverse)',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            N
          </span>
          <span>Nexus</span>
          <span style={{ color: 'var(--df-text-secondary)', fontWeight: 500 }}>
            Email Analytics
          </span>
        </a>

        {/* Desktop links */}
        <ul
          role="list"
          className="hidden md:flex"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: 'var(--df-space-6)',
            alignItems: 'center',
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  color: 'var(--df-text-secondary)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'color var(--df-duration-fast) var(--df-ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--df-text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--df-text-secondary)'
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA cluster */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
          <a
            href="/login"
            style={{
              color: 'var(--df-text-secondary)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Sign in
          </a>
          <a
            href="/signup"
            style={{
              background: 'var(--df-neon-violet)',
              color: 'var(--df-text-inverse)',
              border: 'none',
              borderRadius: 'var(--df-radius-md)',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: 'var(--df-glow-violet)',
              transition: 'box-shadow var(--df-duration-base) var(--df-ease-out)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--df-glow-violet-lg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--df-glow-violet)'
            }}
          >
            Start free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
          style={{
            background: 'var(--df-glass-bg)',
            border: '1px solid var(--df-border-default)',
            borderRadius: 'var(--df-radius-md)',
            color: 'var(--df-text-primary)',
            cursor: 'pointer',
            padding: 8,
            display: 'inline-flex',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden"
            style={{
              overflow: 'hidden',
              background: 'var(--df-bg-elevated)',
              borderTop: '1px solid var(--df-border-subtle)',
            }}
          >
            <ul
              role="list"
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 'var(--df-space-4) clamp(16px, 4vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {[...NAV_LINKS, { label: 'Sign in', href: '/login' }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 8px',
                      color: 'var(--df-text-primary)',
                      textDecoration: 'none',
                      fontSize: 15,
                      fontWeight: 500,
                      borderRadius: 'var(--df-radius-sm)',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: 8 }}>
                <a
                  href="/signup"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    background: 'var(--df-neon-violet)',
                    color: 'var(--df-text-inverse)',
                    borderRadius: 'var(--df-radius-md)',
                    padding: '12px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: 'var(--df-glow-violet)',
                  }}
                >
                  Start free
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ============================================================================
//   HERO  (Hero 3 - Neon Mesh)
// ============================================================================

function Hero() {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--df-bg-base)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)',
        textAlign: 'center',
      }}
    >
      {/* Mesh gradient orbs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-5%',
          left: '20%',
          width: 'min(640px, 80vw)',
          height: 'min(640px, 80vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.20) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '60%',
          right: '-5%',
          width: 'min(560px, 70vw)',
          height: 'min(560px, 70vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 'min(440px, 60vw)',
          height: 'min(440px, 60vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(244,114,182,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}
      >
        <motion.div variants={item} style={{ marginBottom: 24 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background:
                'linear-gradient(90deg, rgba(167,139,250,0.15), rgba(34,211,238,0.15))',
              border: '1px solid rgba(167,139,250,0.25)',
              borderRadius: 'var(--df-radius-full)',
              padding: '5px 14px',
              color: 'var(--df-neon-violet)',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--df-neon-violet)',
                boxShadow: 'var(--df-glow-violet)',
              }}
            />
            New: AI subject-line copilot is live
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          id="hero-heading"
          style={{
            fontSize: 'clamp(36px, 6.5vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--df-text-primary)',
            margin: '0 0 20px',
          }}
        >
          AI-native email{' '}
          <span
            style={{
              background:
                'linear-gradient(135deg, var(--df-neon-violet) 0%, var(--df-neon-cyan) 50%, var(--df-neon-pink) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            analytics
          </span>{' '}
          for outbound that converts
        </motion.h1>

        <motion.p
          variants={item}
          style={{
            color: 'var(--df-text-secondary)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.65,
            margin: '0 auto 36px',
            maxWidth: 620,
          }}
        >
          Score every send against 47 deliverability signals, A/B/n test subject
          lines with AI, and watch cohort-level open rates climb in real time.
          One platform replaces four tools.
        </motion.p>

        <motion.div
          variants={item}
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <motion.a
            href="/signup"
            whileHover={
              reduce
                ? undefined
                : { scale: 1.03, boxShadow: '0 0 40px rgba(167,139,250,0.5)' }
            }
            whileTap={reduce ? undefined : { scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background:
                'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
              color: 'var(--df-text-inverse)',
              border: 'none',
              borderRadius: 'var(--df-radius-md)',
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: 'var(--df-glow-violet)',
            }}
          >
            Start your 14-day trial
            <span aria-hidden>→</span>
          </motion.a>
          <motion.a
            href="#features"
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            style={{
              background: 'var(--df-glass-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--df-glass-border)',
              color: 'var(--df-text-primary)',
              borderRadius: 'var(--df-radius-md)',
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            See how it works
          </motion.a>
        </motion.div>

        <motion.p
          variants={item}
          style={{
            color: 'var(--df-text-muted)',
            fontSize: 13,
            margin: '36px 0 0',
          }}
        >
          Trusted by 4,200+ teams - no credit card required
        </motion.p>
      </motion.div>
    </section>
  )
}

// ============================================================================
//   FEATURES (Bento Grid)
// ============================================================================

function FeaturesBento() {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const spanClass: Record<BentoTile['span'], string> = {
    hero: 'md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[420px]',
    small: 'md:col-span-1 md:row-span-1 min-h-[200px]',
    wide: 'md:col-span-2 md:row-span-1 min-h-[200px]',
  }

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{
        background: 'var(--df-bg-base)',
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 48px)',
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-12 max-w-2xl md:mb-16">
          <p
            style={{
              color: 'var(--df-neon-violet)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Built for teams that ship outbound
          </p>
          <h2
            id="features-heading"
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--df-text-primary)',
              margin: '0 0 16px',
            }}
          >
            Everything email analytics{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              forgot to be
            </span>
          </h2>
          <p
            style={{
              color: 'var(--df-text-secondary)',
              fontSize: 'clamp(15px, 1.7vw, 18px)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            One platform that scores, sends, warms, and routes - replacing four
            tools and two part-time engineers.
          </p>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5"
        >
          {BENTO_TILES.map((tile) => {
            const accent = ACCENT_MAP[tile.accent]
            return (
              <motion.article
                key={tile.id}
                variants={item}
                className={`group relative overflow-hidden ${spanClass[tile.span]}`}
                style={{
                  background: 'var(--df-bg-surface)',
                  border: '1px solid var(--df-border-default)',
                  borderRadius: 'var(--df-radius-xl)',
                  padding: 'clamp(20px, 3vw, 32px)',
                  transition:
                    'border-color var(--df-duration-base) var(--df-ease-out), box-shadow var(--df-duration-base) var(--df-ease-out), transform var(--df-duration-base) var(--df-ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent.border
                  e.currentTarget.style.boxShadow = accent.glow
                  if (!reduce) e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--df-border-default)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Hover wash */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 30% 0%, ${accent.soft} 0%, transparent 60%)`,
                  }}
                />

                <div className="relative flex h-full flex-col justify-between gap-6">
                  <div
                    aria-hidden
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--df-radius-md)',
                      background: accent.soft,
                      border: `1px solid ${accent.border}`,
                      color: accent.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ width: 22, height: 22, display: 'block' }}>
                      {tile.icon}
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{
                        color: 'var(--df-text-primary)',
                        fontSize: tile.span === 'hero' ? 'clamp(22px, 2.4vw, 28px)' : 18,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        letterSpacing: '-0.01em',
                        margin: '0 0 10px',
                      }}
                    >
                      {tile.title}
                    </h3>
                    <p
                      style={{
                        color: 'var(--df-text-secondary)',
                        fontSize: tile.span === 'hero' ? 16 : 14,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {tile.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
//   TESTIMONIALS (Marquee, dual-row)
// ============================================================================

function Testimonials() {
  const mid = Math.ceil(TESTIMONIALS.length / 2)
  const rowA = TESTIMONIALS.slice(0, mid)
  const rowB = TESTIMONIALS.slice(mid)
  const durationSec = 50

  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{
        background: 'var(--df-bg-base)',
        padding: 'clamp(64px, 10vw, 120px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: 56,
          padding: '0 clamp(20px, 4vw, 32px)',
        }}
      >
        <p
          style={{
            color: 'var(--df-neon-pink)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          The receipts
        </p>
        <h2
          id="testimonials-heading"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 700,
            color: 'var(--df-text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          What growth teams are saying right now
        </h2>
      </header>

      <style>{`
        @keyframes nx-marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes nx-marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .nx-marquee-track {
          display: flex;
          gap: var(--df-space-4);
          width: max-content;
          will-change: transform;
        }
        .nx-marquee-track-a {
          animation: nx-marquee-left ${durationSec}s linear infinite;
        }
        .nx-marquee-track-b {
          animation: nx-marquee-right ${durationSec * 1.2}s linear infinite;
        }
        .nx-marquee-viewport:hover .nx-marquee-track,
        .nx-marquee-viewport:focus-within .nx-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .nx-marquee-track-a,
          .nx-marquee-track-b {
            animation: none;
            transform: translateX(0);
          }
        }
        .nx-marquee-mask {
          mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 80px,
            #000 calc(100% - 80px),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 80px,
            #000 calc(100% - 80px),
            transparent 100%
          );
        }
      `}</style>

      <div
        className="nx-marquee-viewport nx-marquee-mask"
        role="group"
        aria-roledescription="testimonial marquee"
        style={{ overflow: 'hidden', marginBottom: 20 }}
      >
        <div className="nx-marquee-track nx-marquee-track-a">
          {[...rowA, ...rowA].map((t, i) => (
            <MarqueeCard key={`a-${i}`} t={t} ariaHidden={i >= rowA.length} />
          ))}
        </div>
      </div>

      <div
        className="nx-marquee-viewport nx-marquee-mask"
        role="group"
        aria-roledescription="testimonial marquee"
        style={{ overflow: 'hidden' }}
      >
        <div className="nx-marquee-track nx-marquee-track-b">
          {[...rowB, ...rowB].map((t, i) => (
            <MarqueeCard key={`b-${i}`} t={t} ariaHidden={i >= rowB.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MarqueeCard({ t, ariaHidden }: { t: Testimonial; ariaHidden: boolean }) {
  return (
    <article
      aria-hidden={ariaHidden ? 'true' : undefined}
      style={{
        flex: '0 0 auto',
        width: 'clamp(300px, 32vw, 380px)',
        background: 'var(--df-glass-bg)',
        border: '1px solid var(--df-glass-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 'var(--df-radius-lg)',
        padding: 'var(--df-space-5)',
      }}
    >
      <p
        style={{
          color: 'var(--df-text-primary)',
          fontSize: 14,
          lineHeight: 1.6,
          margin: '0 0 16px',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src={t.avatar}
          alt=""
          loading="lazy"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid var(--df-border-subtle)',
          }}
        />
        <div>
          <p
            style={{
              color: 'var(--df-text-primary)',
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              color: 'var(--df-text-secondary)',
              fontSize: 11,
              margin: 0,
            }}
          >
            {t.role} <span aria-hidden>-</span>{' '}
            <span style={{ color: 'var(--df-text-accent)' }}>{t.company}</span>
          </p>
        </div>
      </div>
    </article>
  )
}

// ============================================================================
//   PRICING (3-tier glass)
// ============================================================================

function Pricing() {
  const reduce = useReducedMotion()

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{
        background: 'var(--df-bg-base)',
        padding: 'clamp(64px, 10vw, 120px) 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orb */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(640px, 90vw)',
          height: 'min(640px, 90vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            marginBottom: 'var(--df-space-12)',
          }}
        >
          <p
            style={{
              color: 'var(--df-neon-violet)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 'var(--df-space-4)',
            }}
          >
            Pricing
          </p>
          <h2
            id="pricing-heading"
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              color: 'var(--df-text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 var(--df-space-4)',
            }}
          >
            Pricing built to{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              scale with you
            </span>
          </h2>
          <p
            style={{
              color: 'var(--df-text-secondary)',
              fontSize: 'clamp(15px, 1.7vw, 18px)',
              lineHeight: 1.6,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Start free. Upgrade only when your campaigns deserve a bigger
            stage. No credit card to begin.
          </p>
        </header>

        <ul
          role="list"
          style={{
            display: 'grid',
            gap: 'var(--df-space-6)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            alignItems: 'stretch',
          }}
        >
          {PRICING_TIERS.map((tier, i) => (
            <motion.li
              key={tier.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              aria-label={`${tier.name} plan${tier.highlighted ? ', recommended' : ''}`}
              style={{ position: 'relative', listStyle: 'none' }}
            >
              {tier.highlighted && (
                <span
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background:
                      'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-pink))',
                    color: 'var(--df-text-inverse)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 'var(--df-radius-full)',
                    boxShadow: 'var(--df-glow-violet)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    zIndex: 1,
                  }}
                >
                  Most popular
                </span>
              )}

              <div
                style={{
                  background: tier.highlighted
                    ? 'var(--df-glass-bg-md)'
                    : 'var(--df-glass-bg)',
                  border: tier.highlighted
                    ? '1px solid rgba(167,139,250,0.45)'
                    : '1px solid var(--df-glass-border)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderRadius: 'var(--df-radius-xl)',
                  padding: 'var(--df-space-8)',
                  boxShadow: tier.highlighted
                    ? '0 0 60px rgba(167,139,250,0.20), 0 24px 48px rgba(0,0,0,0.4)'
                    : '0 12px 32px rgba(0,0,0,0.3)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3
                  style={{
                    color: tier.highlighted
                      ? 'var(--df-neon-violet)'
                      : 'var(--df-text-primary)',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: 0,
                  }}
                >
                  {tier.name}
                </h3>

                <p
                  style={{
                    color: 'var(--df-text-secondary)',
                    fontSize: 14,
                    lineHeight: 1.5,
                    margin: '8px 0 var(--df-space-6)',
                    minHeight: 42,
                  }}
                >
                  {tier.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                    marginBottom: 'var(--df-space-6)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--df-text-primary)',
                      fontSize: 48,
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ${tier.price}
                  </span>
                  <span
                    style={{
                      color: 'var(--df-text-muted)',
                      fontSize: 13,
                    }}
                  >
                    {tier.period}
                  </span>
                </div>

                <ul
                  role="list"
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 var(--df-space-8)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--df-space-3)',
                    flexGrow: 1,
                  }}
                >
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        color: 'var(--df-text-secondary)',
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: tier.highlighted
                            ? 'rgba(167,139,250,0.15)'
                            : 'rgba(74,222,128,0.10)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 1,
                          boxShadow: tier.highlighted
                            ? '0 0 10px rgba(167,139,250,0.4)'
                            : 'none',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={
                            tier.highlighted
                              ? 'var(--df-neon-violet)'
                              : 'var(--df-neon-green)'
                          }
                          strokeWidth="3"
                        >
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.id === 'enterprise' ? '/contact-sales' : '/signup'}
                  aria-label={`${tier.cta} on ${tier.name} plan`}
                  style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    background: tier.highlighted
                      ? 'var(--df-neon-violet)'
                      : 'transparent',
                    color: tier.highlighted
                      ? 'var(--df-text-inverse)'
                      : 'var(--df-text-primary)',
                    border: tier.highlighted
                      ? 'none'
                      : '1px solid var(--df-border-default)',
                    borderRadius: 'var(--df-radius-md)',
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: tier.highlighted ? 'var(--df-glow-violet)' : 'none',
                    transition:
                      'transform var(--df-duration-fast) var(--df-ease-out), box-shadow var(--df-duration-base) var(--df-ease-out), background var(--df-duration-base) var(--df-ease-out)',
                  }}
                  onMouseEnter={(e) => {
                    if (reduce) return
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    if (tier.highlighted) {
                      e.currentTarget.style.boxShadow = 'var(--df-glow-violet-lg)'
                    } else {
                      e.currentTarget.style.background = 'var(--df-bg-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    if (tier.highlighted) {
                      e.currentTarget.style.boxShadow = 'var(--df-glow-violet)'
                    } else {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {tier.cta}
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ============================================================================
//   CTA (Full-width gradient band)
// ============================================================================

function CTA() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--df-bg-base)',
        overflow: 'hidden',
        padding: 'clamp(64px, 10vw, 128px) 24px',
      }}
    >
      {/* Mesh gradient orbs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: 'min(640px, 80vw)',
          height: 'min(640px, 80vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: 'min(720px, 90vw)',
          height: 'min(720px, 90vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(420px, 70vw)',
          height: 'min(420px, 70vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        ref={ref}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          maxWidth: 920,
          margin: '0 auto',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <p
          style={{
            color: 'var(--df-neon-violet)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          Ready when you are
        </p>

        <h2
          id="cta-heading"
          style={{
            color: 'var(--df-text-primary)',
            fontSize: 'clamp(32px, 5.5vw, 60px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            margin: '0 0 20px',
          }}
        >
          Start your 14-day trial.{' '}
          <span
            style={{
              background:
                'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            No card needed.
          </span>
        </h2>

        <p
          style={{
            color: 'var(--df-text-secondary)',
            fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.6,
            maxWidth: 620,
            margin: '0 auto 36px',
          }}
        >
          Spin up Nexus in under five minutes, connect your first mailbox, and
          watch deliverability climb before your trial ends.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--df-neon-violet)',
              color: 'var(--df-text-inverse)',
              border: 'none',
              borderRadius: 'var(--df-radius-md)',
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--df-glow-violet)',
              transition:
                'transform var(--df-duration-fast) var(--df-ease-out), box-shadow var(--df-duration-base) var(--df-ease-out)',
            }}
            onMouseEnter={(e) => {
              if (reduce) return
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = 'var(--df-glow-violet-lg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--df-glow-violet)'
            }}
          >
            Start your 14-day trial
            <span aria-hidden>→</span>
          </a>
          <a
            href="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--df-glass-bg)',
              color: 'var(--df-text-primary)',
              border: '1px solid var(--df-border-default)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 'var(--df-radius-md)',
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer',
              transition:
                'border-color var(--df-duration-fast) var(--df-ease-out), background var(--df-duration-fast) var(--df-ease-out)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--df-border-strong)'
              e.currentTarget.style.background = 'var(--df-glass-bg-md)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--df-border-default)'
              e.currentTarget.style.background = 'var(--df-glass-bg)'
            }}
          >
            Book a demo
          </a>
        </div>

        <p
          style={{
            color: 'var(--df-text-muted)',
            fontSize: 13,
            margin: '36px 0 0',
          }}
        >
          Trusted by 4,200+ teams - migration in under a day, included on every plan.
        </p>
      </motion.div>
    </section>
  )
}

// ============================================================================
//   FOOTER
// ============================================================================

function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!email || !email.includes('@')) return
      // VERIFY: wire to your real newsletter endpoint
      setSubmitted(true)
      setEmail('')
    },
    [email],
  )

  return (
    <footer
      role="contentinfo"
      style={{
        background: 'var(--df-bg-base)',
        borderTop: '1px solid var(--df-border-subtle)',
        padding: 'clamp(48px, 8vw, 80px) clamp(20px, 4vw, 32px) 32px',
      }}
    >
      <div
        className="mx-auto w-full max-w-6xl"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--df-space-12)' }}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-4">
            <a
              href="/"
              aria-label="Nexus Email Analytics home"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                color: 'var(--df-text-primary)',
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 16,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--df-radius-md)',
                  background:
                    'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
                  boxShadow: 'var(--df-glow-violet)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--df-text-inverse)',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                N
              </span>
              <span>Nexus</span>
              <span style={{ color: 'var(--df-text-secondary)', fontWeight: 500 }}>
                Email Analytics
              </span>
            </a>

            <p
              style={{
                color: 'var(--df-text-secondary)',
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 24px',
                maxWidth: 320,
              }}
            >
              AI-native email analytics for outbound that converts. Score, send,
              warm, and route - all in one platform.
            </p>

            <form
              onSubmit={handleSubmit}
              aria-label="Subscribe to product updates"
              style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
            >
              <label
                htmlFor="footer-newsletter"
                style={{
                  color: 'var(--df-text-secondary)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Product updates, monthly
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-describedby="newsletter-status"
                  style={{
                    flex: 1,
                    background: 'var(--df-bg-elevated)',
                    border: '1px solid var(--df-border-default)',
                    borderRadius: 'var(--df-radius-md)',
                    padding: '10px 12px',
                    color: 'var(--df-text-primary)',
                    fontSize: 13,
                    outline: 'none',
                    transition:
                      'border-color var(--df-duration-fast) var(--df-ease-out), box-shadow var(--df-duration-fast) var(--df-ease-out)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--df-border-focus)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.12)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--df-border-default)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--df-neon-violet)',
                    color: 'var(--df-text-inverse)',
                    border: 'none',
                    borderRadius: 'var(--df-radius-md)',
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--df-glow-violet)',
                    flexShrink: 0,
                  }}
                >
                  Subscribe
                </button>
              </div>
              <p
                id="newsletter-status"
                role="status"
                aria-live="polite"
                style={{
                  color: submitted ? 'var(--df-neon-green)' : 'var(--df-text-muted)',
                  fontSize: 12,
                  margin: '4px 0 0',
                  minHeight: 18,
                }}
              >
                {submitted
                  ? "You're in. Check your inbox to confirm."
                  : 'No spam. Unsubscribe in one click.'}
              </p>
            </form>
          </div>

          {/* Footer columns */}
          <div className="md:col-span-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p
                  style={{
                    color: 'var(--df-text-primary)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: '0 0 16px',
                  }}
                >
                  {col.title}
                </p>
                <ul
                  role="list"
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        style={{
                          color: 'var(--df-text-secondary)',
                          fontSize: 14,
                          textDecoration: 'none',
                          transition: 'color var(--df-duration-fast) var(--df-ease-out)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--df-text-primary)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--df-text-secondary)'
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--df-border-subtle)',
            paddingTop: 'var(--df-space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--df-text-muted)',
              fontSize: 13,
              margin: 0,
            }}
          >
            &copy; 2026 Nexus Email Analytics, Inc. All rights reserved.
          </p>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--df-text-muted)',
              fontSize: 12,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--df-neon-green)',
                boxShadow: 'var(--df-glow-green)',
              }}
            />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
//   PAGE
// ============================================================================

export default function LandingSaaS() {
  return (
    <main
      style={{
        background: 'var(--df-bg-base)',
        color: 'var(--df-text-primary)',
        fontFamily: 'var(--df-font-sans)',
        minHeight: '100vh',
      }}
    >
      <NavBar />
      <Hero />
      <FeaturesBento />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
