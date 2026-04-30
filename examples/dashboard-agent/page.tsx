// =============================================================================
// Nexus Email Analytics — Dashboard + Agent
// -----------------------------------------------------------------------------
// Single-file Next.js 14 App Router page composing 6 Darkforge patterns into the
// "logged-in product UI" demo for Darkforge v1.0.
//
// Composes:
//   patterns/dashboard.md  — ThreePaneShell, StatsGrid, CampaignTable, AgentChatInterface, CommandPalette, Sidebar
//   patterns/navbar.md     — Minimal App navbar variant
//
// Source-of-truth caveat:
//   Generated from training-data recall (Jan 2026 cutoff). context7 + WebFetch
//   were denied at generation time. // VERIFY: comments mark prop signatures
//   that may have shifted between minor framer-motion versions. Cross-check
//   against live docs before shipping to production.
// =============================================================================

'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  // VERIFY: framer-motion v11+ exports these from the root entry; v10 used 'framer-motion/dist/...'
} from 'framer-motion'

// ---------------------------------------------------------------------------
// Brand + nav data
// ---------------------------------------------------------------------------

const BRAND = {
  name: 'Nexus Email Analytics',
  short: 'Nexus',
  tagline: 'Inbox health, in real time.',
}

type SectionKey =
  | 'overview'
  | 'campaigns'
  | 'inbox-health'
  | 'agent'
  | 'settings'

const SECTIONS: { key: SectionKey; label: string; glyph: string; hint?: string }[] = [
  { key: 'overview', label: 'Overview', glyph: '◇' },
  { key: 'campaigns', label: 'Campaigns', glyph: '◈', hint: '12 live' },
  { key: 'inbox-health', label: 'Inbox health', glyph: '◉' },
  { key: 'agent', label: 'AI agent', glyph: '✦', hint: 'beta' },
  { key: 'settings', label: 'Settings', glyph: '⚙' },
]

// ---------------------------------------------------------------------------
// Stats data — 4 cards on Overview pane
// ---------------------------------------------------------------------------

type Stat = {
  key: string
  label: string
  value: number
  delta: number
  format: 'int' | 'pct'
  spark: number[]
}

const STATS: Stat[] = [
  { key: 'sent', label: 'Sent (24h)', value: 184_220, delta: 12.4, format: 'int', spark: [12, 18, 22, 19, 26, 31, 38, 42, 46, 52, 58, 63] },
  { key: 'delivered', label: 'Delivered', value: 178_604, delta: 11.8, format: 'int', spark: [11, 17, 21, 18, 25, 30, 36, 41, 44, 50, 56, 61] },
  { key: 'replies', label: 'Replies', value: 6_412, delta: 4.2, format: 'int', spark: [3, 4, 5, 4, 6, 7, 8, 7, 9, 10, 11, 12] },
  { key: 'bounce', label: 'Bounce rate', value: 2.4, delta: -0.6, format: 'pct', spark: [4.1, 3.8, 3.6, 3.5, 3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4] },
]

// ---------------------------------------------------------------------------
// Campaigns table
// ---------------------------------------------------------------------------

type Status = 'live' | 'warming' | 'paused' | 'done'

type Campaign = {
  id: string
  name: string
  client: string
  status: Status
  sent: number
  reply: number // percentage
  bounce: number // percentage
  updated: string // relative time
}

const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Q2 Outbound — Ramp', client: 'Ramp', status: 'live', sent: 24_180, reply: 6.2, bounce: 1.8, updated: '2m ago' },
  { id: 'c2', name: 'Series B announce — Mercury', client: 'Mercury', status: 'live', sent: 18_402, reply: 7.4, bounce: 2.1, updated: '14m ago' },
  { id: 'c3', name: 'Acme — re-engagement', client: 'Acme', status: 'warming', sent: 4_220, reply: 3.1, bounce: 9.2, updated: '1h ago' },
  { id: 'c4', name: 'Lattice — design partner', client: 'Lattice', status: 'live', sent: 9_840, reply: 11.2, bounce: 1.4, updated: '38m ago' },
  { id: 'c5', name: 'Reflect — newsletter', client: 'Reflect', status: 'paused', sent: 2_100, reply: 2.4, bounce: 4.0, updated: '3h ago' },
  { id: 'c6', name: 'Cal.com — meeting prompts', client: 'Cal.com', status: 'live', sent: 31_504, reply: 8.9, bounce: 1.2, updated: '6m ago' },
  { id: 'c7', name: 'Plaid — onboarding', client: 'Plaid', status: 'done', sent: 12_900, reply: 5.4, bounce: 1.7, updated: '2d ago' },
  { id: 'c8', name: 'Linear — winback', client: 'Linear', status: 'live', sent: 7_210, reply: 4.6, bounce: 2.3, updated: '22m ago' },
]

// ---------------------------------------------------------------------------
// Agent seed conversation
// ---------------------------------------------------------------------------

type ChatMsg = {
  id: string
  role: 'user' | 'agent'
  content: ReactNode
  ts: string
}

const SEED_CONVO: ChatMsg[] = [
  {
    id: 'm1',
    role: 'user',
    ts: '09:42',
    content: 'Why did the Acme campaign bounce rate spike this morning?',
  },
  {
    id: 'm2',
    role: 'agent',
    ts: '09:42',
    content: (
      <>
        Looked into it. <strong style={{ color: 'var(--df-text-primary)' }}>Acme — re-engagement</strong> jumped from 2.1% to 9.2% bounces between 06:00 and 08:00 UTC. Three signals stand out:
        <ol style={{ margin: '10px 0 4px', paddingLeft: 18, lineHeight: 1.6 }}>
          <li>List ingested from a 14-month-old export — staleness is the dominant factor (~62% of bounces are <code style={{ background: 'var(--df-glass-bg)', padding: '1px 6px', borderRadius: 4 }}>550 5.1.1</code>, recipient unknown).</li>
          <li>Domain <code style={{ background: 'var(--df-glass-bg)', padding: '1px 6px', borderRadius: 4 }}>nexus-mail-3</code> is at 88% of its daily warmup ceiling — pushing more volume there will compound the issue.</li>
          <li>SPF passes but DMARC alignment fails on 4% of sends — fixable by switching the From header to the warmed subdomain.</li>
        </ol>
      </>
    ),
  },
  {
    id: 'm3',
    role: 'user',
    ts: '09:43',
    content: 'Pause Acme and draft a list-cleanup plan?',
  },
  {
    id: 'm4',
    role: 'agent',
    ts: '09:43',
    content: (
      <>
        Done — Acme paused at 09:43 (12,418 sends suppressed). Drafted a 3-step cleanup plan:
        <ol style={{ margin: '10px 0 4px', paddingLeft: 18, lineHeight: 1.6 }}>
          <li>Run the list through ZeroBounce (est. 4,200 invalids removed, ~$84).</li>
          <li>Re-warm <code style={{ background: 'var(--df-glass-bg)', padding: '1px 6px', borderRadius: 4 }}>nexus-mail-3</code> with 200/day for 7 days before resuming.</li>
          <li>Switch the From header to <code style={{ background: 'var(--df-glass-bg)', padding: '1px 6px', borderRadius: 4 }}>hello@send.acme-co.com</code> (DMARC-aligned).</li>
        </ol>
        Want me to schedule the cleanup run, or send the plan to your inbox?
      </>
    ),
  },
]

const SUGGESTIONS = [
  'Investigate the spike',
  'Draft warmup plan',
  'Compare to last week',
  'Schedule cleanup run',
]

// ---------------------------------------------------------------------------
// Command palette actions
// ---------------------------------------------------------------------------

type Cmd = { id: string; label: string; group: string; hint?: string }

const COMMANDS: Cmd[] = [
  { id: 'create-campaign', label: 'Create campaign', group: 'Actions', hint: 'C' },
  { id: 'open-inbox-health', label: 'Open inbox health', group: 'Navigate' },
  { id: 'talk-to-agent', label: 'Talk to AI agent', group: 'Navigate', hint: '⌘ /' },
  { id: 'pause-all', label: 'Pause all live campaigns', group: 'Actions' },
  { id: 'export-csv', label: 'Export campaigns CSV', group: 'Actions' },
  { id: 'invite-teammate', label: 'Invite teammate', group: 'Settings' },
  { id: 'switch-workspace', label: 'Switch workspace', group: 'Settings' },
  { id: 'logout', label: 'Sign out', group: 'Settings' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(value: number, format: 'int' | 'pct') {
  if (format === 'pct') return `${value.toFixed(1)}%`
  return value.toLocaleString('en-US')
}

function statusColor(status: Status) {
  switch (status) {
    case 'live':
      return { fg: 'var(--df-neon-emerald)', bg: 'rgba(74, 222, 128, 0.12)' }
    case 'warming':
      return { fg: 'var(--df-neon-amber)', bg: 'rgba(251, 191, 36, 0.12)' }
    case 'paused':
      return { fg: 'var(--df-text-secondary)', bg: 'rgba(255, 255, 255, 0.06)' }
    case 'done':
      return { fg: 'var(--df-neon-cyan)', bg: 'rgba(78, 162, 255, 0.10)' }
  }
}

// rAF count-up — used in StatCard
function useCountUp(target: number, ms = 1100) {
  const [v, setV] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) {
      setV(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - t, 3)
      setV(from + (target - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, reduced])
  return v
}

// ---------------------------------------------------------------------------
// Top navbar (minimal app variant)
// ---------------------------------------------------------------------------

function TopBar({
  active,
  onOpenPalette,
  onToggleSidebar,
}: {
  active: SectionKey
  onOpenPalette: () => void
  onToggleSidebar: () => void
}) {
  const activeLabel = SECTIONS.find((s) => s.key === active)?.label ?? 'Overview'

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 16,
        background: 'var(--df-bg-base)',
        borderBottom: '1px solid var(--df-border-subtle)',
      }}
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="lg:hidden"
        style={{
          background: 'transparent', border: 0,
          color: 'var(--df-text-secondary)', fontSize: 20, cursor: 'pointer',
        }}
      >
        ☰
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-hidden="true"
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--df-neon-violet) 0%, var(--df-neon-cyan) 100%)',
            boxShadow: 'var(--df-glow-violet)',
          }}
        />
        <span style={{ color: 'var(--df-text-primary)', fontWeight: 600, letterSpacing: '-0.01em' }}>
          {BRAND.short}
        </span>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--df-text-tertiary)', fontSize: 14 }}>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--df-text-secondary)' }}>Workspace</span>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--df-text-primary)' }}>{activeLabel}</span>
      </nav>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Open command palette"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 34, padding: '0 12px',
          background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
          border: '1px solid var(--df-glass-border)',
          borderRadius: 'var(--df-radius-md)',
          color: 'var(--df-text-secondary)', fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <span>Search or jump to…</span>
        <kbd
          style={{
            padding: '2px 6px', fontSize: 11, fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--df-glass-border)',
            borderRadius: 4, color: 'var(--df-text-tertiary)',
          }}
        >
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        aria-label="Account menu"
        style={{
          width: 34, height: 34, borderRadius: 999,
          background: 'linear-gradient(135deg, var(--df-neon-cyan) 0%, var(--df-neon-violet) 100%)',
          border: '1px solid var(--df-glass-border)',
          color: '#000', fontWeight: 700, fontSize: 13,
          cursor: 'pointer',
        }}
      >
        K
      </button>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: SectionKey
  onSelect: (k: SectionKey) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden"
            style={{
              position: 'fixed', inset: 0, zIndex: 35,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      <aside
        aria-label="Primary navigation"
        style={{
          width: 232, flexShrink: 0,
          padding: '20px 14px',
          background: 'var(--df-bg-elev-1)',
          borderRight: '1px solid var(--df-border-subtle)',
          display: 'flex', flexDirection: 'column', gap: 6,
          // Mobile slide-in: handled below via inline styles + class
        }}
        className={`dash-sidebar ${open ? 'dash-sidebar--open' : ''}`}
      >
        <div style={{ padding: '6px 10px 14px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--df-text-tertiary)' }}>
          Workspace
        </div>

        {SECTIONS.map((s) => {
          const isActive = s.key === active
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => { onSelect(s.key); onClose() }}
              aria-current={isActive ? 'page' : undefined}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px',
                background: isActive ? 'var(--df-glass-bg)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--df-glass-border)' : 'transparent',
                borderRadius: 'var(--df-radius-md)',
                color: isActive ? 'var(--df-text-primary)' : 'var(--df-text-secondary)',
                fontSize: 14, textAlign: 'left', cursor: 'pointer',
                transition: 'background 160ms, color 160ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="dash-sidebar-active"
                  aria-hidden="true"
                  style={{
                    position: 'absolute', left: 0, top: 8, bottom: 8, width: 2,
                    background: 'var(--df-neon-violet)',
                    boxShadow: 'var(--df-glow-violet)',
                    borderRadius: 2,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span aria-hidden="true" style={{ width: 16, textAlign: 'center', color: isActive ? 'var(--df-neon-violet)' : 'var(--df-text-tertiary)' }}>
                {s.glyph}
              </span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.hint && (
                <span style={{ fontSize: 11, color: 'var(--df-text-tertiary)' }}>{s.hint}</span>
              )}
            </button>
          )
        })}

        <div style={{ flex: 1 }} />

        <div
          style={{
            padding: 12, marginTop: 12,
            background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--df-glass-border)',
            borderRadius: 'var(--df-radius-md)',
            fontSize: 12, color: 'var(--df-text-secondary)',
          }}
        >
          <div style={{ color: 'var(--df-text-primary)', fontWeight: 600, marginBottom: 4 }}>
            Trial · 12 days left
          </div>
          <div style={{ marginBottom: 10, lineHeight: 1.5 }}>
            All features unlocked until Apr 30.
          </div>
          <a
            href="#upgrade"
            style={{
              display: 'inline-block', padding: '6px 10px',
              background: 'var(--df-neon-violet)', color: '#000',
              borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Upgrade
          </a>
        </div>
      </aside>

      <style>{`
        .dash-sidebar { transition: transform 220ms ease; }
        @media (max-width: 1023px) {
          .dash-sidebar {
            position: fixed; top: 0; bottom: 0; left: 0; z-index: 40;
            transform: translateX(-100%);
          }
          .dash-sidebar--open { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

// ---------------------------------------------------------------------------
// Stat card with rAF count-up + sparkline
// ---------------------------------------------------------------------------

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 96
  const h = 28
  const step = w / (values.length - 1)
  const d = values
    .map((v, i) => {
      const x = i * step
      const y = h - ((v - min) / range) * h
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} aria-hidden="true" style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
    </svg>
  )
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const reduced = useReducedMotion()
  const v = useCountUp(stat.value)
  const positive = stat.delta >= 0
  // For bounce rate, "negative delta" is good — invert color
  const isGoodChange = stat.key === 'bounce' ? !positive : positive

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{
        position: 'relative',
        padding: 20,
        background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--df-glass-border)',
        borderRadius: 'var(--df-radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: 'var(--df-text-tertiary)' }}>{stat.label}</span>
        <Sparkline values={stat.spark} accent="var(--df-neon-violet)" />
      </div>
      <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--df-text-primary)' }}>
        {stat.format === 'pct' ? `${v.toFixed(1)}%` : Math.round(v).toLocaleString('en-US')}
      </div>
      <div
        style={{
          marginTop: 6, fontSize: 12,
          color: isGoodChange ? 'var(--df-neon-emerald)' : 'var(--df-neon-rose)',
        }}
      >
        {positive ? '▲' : '▼'} {Math.abs(stat.delta).toFixed(1)}% vs last 24h
      </div>
    </motion.div>
  )
}

function StatsGrid() {
  return (
    <div
      style={{
        display: 'grid', gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        marginBottom: 28,
      }}
    >
      {STATS.map((s, i) => (
        <StatCard key={s.key} stat={s} index={i} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Campaigns table
// ---------------------------------------------------------------------------

type SortKey = 'name' | 'sent' | 'reply' | 'bounce' | 'updated'

function CampaignTable() {
  const [sortKey, setSortKey] = useState<SortKey>('sent')
  const [asc, setAsc] = useState(false)

  const rows = useMemo(() => {
    const sorted = [...CAMPAIGNS].sort((a, b) => {
      const av = a[sortKey] as string | number
      const bv = b[sortKey] as string | number
      if (typeof av === 'number' && typeof bv === 'number') return asc ? av - bv : bv - av
      return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return sorted
  }, [sortKey, asc])

  function toggle(k: SortKey) {
    if (k === sortKey) setAsc(!asc)
    else { setSortKey(k); setAsc(false) }
  }

  return (
    <div
      style={{
        background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--df-glass-border)',
        borderRadius: 'var(--df-radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--df-border-subtle)' }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--df-text-primary)' }}>Campaigns</h2>
        <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--df-text-tertiary)' }}>
          {CAMPAIGNS.length} total · {CAMPAIGNS.filter((c) => c.status === 'live').length} live
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          style={{
            padding: '7px 12px', fontSize: 13, fontWeight: 500,
            background: 'var(--df-neon-violet)', color: '#000', border: 0,
            borderRadius: 'var(--df-radius-md)', cursor: 'pointer',
            boxShadow: 'var(--df-glow-violet)',
          }}
        >
          + New campaign
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ color: 'var(--df-text-tertiary)' }}>
              {([
                ['name', 'Campaign'],
                ['sent', 'Sent'],
                ['reply', 'Reply %'],
                ['bounce', 'Bounce %'],
                ['updated', 'Updated'],
              ] as [SortKey, string][]).map(([k, label]) => (
                <th
                  key={k}
                  scope="col"
                  onClick={() => toggle(k)}
                  style={{
                    textAlign: 'left', padding: '10px 16px', fontWeight: 500, fontSize: 12,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    cursor: 'pointer', userSelect: 'none',
                  }}
                >
                  {label}
                  {sortKey === k && <span aria-hidden="true" style={{ marginLeft: 6 }}>{asc ? '▲' : '▼'}</span>}
                </th>
              ))}
              <th scope="col" style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const sc = statusColor(c.status)
              return (
                <tr
                  key={c.id}
                  className="dash-row"
                  style={{ borderTop: '1px solid var(--df-border-subtle)', color: 'var(--df-text-secondary)' }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: 'var(--df-text-primary)', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--df-text-tertiary)', marginTop: 2 }}>{c.client}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.sent.toLocaleString('en-US')}
                  </td>
                  <td style={{ padding: '12px 16px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.reply.toFixed(1)}%
                  </td>
                  <td style={{ padding: '12px 16px', fontVariantNumeric: 'tabular-nums', color: c.bounce > 5 ? 'var(--df-neon-rose)' : undefined }}>
                    {c.bounce.toFixed(1)}%
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--df-text-tertiary)' }}>
                    {c.updated}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 999,
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                        background: sc.bg, color: sc.fg,
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .dash-row { transition: background 140ms; }
        .dash-row:hover {
          background: rgba(167, 139, 250, 0.06);
          box-shadow: inset 0 0 0 1px rgba(167, 139, 250, 0.18);
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Agent chat interface
// ---------------------------------------------------------------------------

function TypingDots() {
  const reduced = useReducedMotion()
  if (reduced) return <span style={{ color: 'var(--df-text-tertiary)' }}>typing…</span>
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }} aria-label="Agent is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--df-neon-violet)' }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

function AgentChatInterface() {
  const reduced = useReducedMotion()
  const [messages, setMessages] = useState<ChatMsg[]>(SEED_CONVO)
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  const send = useCallback((text: string) => {
    if (!text.trim()) return
    const id = Math.random().toString(36).slice(2)
    setMessages((m) => [
      ...m,
      { id, role: 'user', content: text, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ])
    setDraft('')
    setPending(true)
    // Stub: agent reply after 1.4s. Replace with real /api/agent stream.
    window.setTimeout(() => {
      setPending(false)
      setMessages((m) => [
        ...m,
        {
          id: id + 'r',
          role: 'agent',
          ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: 'Working on it — connect this to your real agent backend at /api/agent.',
        },
      ])
    }, 1400)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--df-border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 10, height: 10, borderRadius: 999,
            background: 'var(--df-neon-emerald)',
            boxShadow: '0 0 12px var(--df-neon-emerald)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--df-text-primary)' }}>Nexus AI agent</span>
          <span style={{ fontSize: 12, color: 'var(--df-text-tertiary)' }}>Reads your campaigns, drafts plans, takes actions.</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              padding: '10px 14px',
              fontSize: 14, lineHeight: 1.5,
              background: m.role === 'user' ? 'var(--df-neon-violet)' : 'var(--df-glass-bg)',
              backdropFilter: m.role === 'user' ? undefined : 'blur(10px)',
              border: m.role === 'user' ? 'none' : '1px solid var(--df-glass-border)',
              color: m.role === 'user' ? '#000' : 'var(--df-text-secondary)',
              borderRadius: m.role === 'user'
                ? 'var(--df-radius-md) var(--df-radius-md) 4px var(--df-radius-md)'
                : 'var(--df-radius-md) var(--df-radius-md) var(--df-radius-md) 4px',
              boxShadow: m.role === 'user' ? 'var(--df-glow-violet)' : undefined,
            }}
          >
            {m.content}
            <div
              style={{
                marginTop: 4, fontSize: 10, opacity: 0.7,
                color: m.role === 'user' ? 'rgba(0,0,0,0.65)' : 'var(--df-text-tertiary)',
              }}
            >
              {m.ts}
            </div>
          </motion.div>
        ))}

        {pending && (
          <div
            style={{
              alignSelf: 'flex-start', padding: '10px 14px',
              background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--df-glass-border)',
              borderRadius: 'var(--df-radius-md) var(--df-radius-md) var(--df-radius-md) 4px',
            }}
          >
            <TypingDots />
          </div>
        )}
      </div>

      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--df-border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              style={{
                padding: '5px 10px', fontSize: 12,
                background: 'transparent',
                border: '1px solid var(--df-glass-border)',
                borderRadius: 999,
                color: 'var(--df-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(draft) }}
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask the agent…"
            aria-label="Message the agent"
            style={{
              flex: 1, height: 40, padding: '0 14px',
              background: 'var(--df-bg-elev-1)',
              border: '1px solid var(--df-glass-border)',
              borderRadius: 'var(--df-radius-md)',
              color: 'var(--df-text-primary)', fontSize: 14, outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--df-neon-violet)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--df-glass-border)' }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || pending}
            aria-label="Send message"
            style={{
              height: 40, padding: '0 16px',
              background: draft.trim() ? 'var(--df-neon-violet)' : 'var(--df-glass-bg)',
              color: draft.trim() ? '#000' : 'var(--df-text-tertiary)',
              border: 0, borderRadius: 'var(--df-radius-md)',
              fontWeight: 600, fontSize: 14,
              cursor: draft.trim() ? 'pointer' : 'not-allowed',
              boxShadow: draft.trim() ? 'var(--df-glow-violet)' : undefined,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Command palette
// ---------------------------------------------------------------------------

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
    else setQ('')
  }, [open])

  const filtered = useMemo(() => {
    if (!q.trim()) return COMMANDS
    const needle = q.toLowerCase()
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(needle) || c.group.toLowerCase().includes(needle))
  }, [q])

  // Group by section
  const grouped = useMemo(() => {
    const map = new Map<string, Cmd[]>()
    for (const c of filtered) {
      if (!map.has(c.group)) map.set(c.group, [])
      map.get(c.group)!.push(c)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 90,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', top: '14vh', left: '50%', transform: 'translateX(-50%)',
              zIndex: 91, width: 'min(560px, calc(100vw - 32px))',
              background: 'var(--df-bg-elev-2)',
              border: '1px solid var(--df-glass-border)',
              borderRadius: 'var(--df-radius-lg)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(167,139,250,0.18)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', borderBottom: '1px solid var(--df-border-subtle)' }}>
              <span aria-hidden="true" style={{ color: 'var(--df-text-tertiary)', marginRight: 8 }}>⌘</span>
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                style={{
                  flex: 1, height: 48, background: 'transparent', border: 0, outline: 'none',
                  color: 'var(--df-text-primary)', fontSize: 15,
                }}
              />
              <kbd
                style={{
                  fontSize: 11, padding: '2px 6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--df-glass-border)',
                  borderRadius: 4, color: 'var(--df-text-tertiary)',
                }}
              >
                Esc
              </kbd>
            </div>

            <div style={{ maxHeight: '52vh', overflowY: 'auto', padding: '8px 0' }}>
              {grouped.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--df-text-tertiary)', fontSize: 13 }}>
                  No matches.
                </div>
              )}
              {grouped.map(([group, items]) => (
                <div key={group} style={{ padding: '4px 0' }}>
                  <div style={{ padding: '6px 16px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--df-text-tertiary)' }}>
                    {group}
                  </div>
                  {items.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { onClose(); /* hook a real handler here */ }}
                      style={{
                        display: 'flex', alignItems: 'center', width: '100%',
                        padding: '9px 16px', background: 'transparent', border: 0,
                        color: 'var(--df-text-secondary)', textAlign: 'left',
                        fontSize: 14, cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; e.currentTarget.style.color = 'var(--df-text-primary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--df-text-secondary)' }}
                    >
                      <span style={{ flex: 1 }}>{c.label}</span>
                      {c.hint && (
                        <kbd
                          style={{
                            fontSize: 11, padding: '2px 6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--df-glass-border)',
                            borderRadius: 4, color: 'var(--df-text-tertiary)',
                          }}
                        >
                          {c.hint}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Main panes
// ---------------------------------------------------------------------------

function OverviewPane() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--df-text-primary)' }}>
          Good morning, Karan
        </h1>
        <p style={{ margin: '6px 0 0', color: 'var(--df-text-secondary)', fontSize: 14 }}>
          {BRAND.tagline} · 8 campaigns live, 2 need attention.
        </p>
      </div>
      <StatsGrid />
      <CampaignTable />
    </div>
  )
}

function PlaceholderPane({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: 48, borderRadius: 'var(--df-radius-lg)',
        background: 'var(--df-glass-bg)', backdropFilter: 'blur(10px)',
        border: '1px dashed var(--df-glass-border)',
        color: 'var(--df-text-secondary)', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--df-text-primary)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13 }}>
        This pane is wired to its sidebar entry but its UI is out of scope for this demo.
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Right pane (agent) — collapses to drawer on mobile
// ---------------------------------------------------------------------------

function RightPane({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Desktop: sticky pane */}
      <aside
        aria-label="AI agent"
        className="dash-rightpane"
        style={{
          width: 380, flexShrink: 0,
          background: 'var(--df-bg-elev-1)',
          borderLeft: '1px solid var(--df-border-subtle)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <AgentChatInterface />
      </aside>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="dash-rightpane-mobile-overlay"
              style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              }}
            />
            <motion.aside
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="dash-rightpane-mobile"
              aria-label="AI agent"
              style={{
                position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 51,
                height: '82vh',
                background: 'var(--df-bg-elev-1)',
                borderTop: '1px solid var(--df-glass-border)',
                borderTopLeftRadius: 16, borderTopRightRadius: 16,
                display: 'flex', flexDirection: 'column',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close agent drawer"
                style={{
                  position: 'absolute', top: 10, right: 14, zIndex: 1,
                  background: 'transparent', border: 0, cursor: 'pointer',
                  color: 'var(--df-text-tertiary)', fontSize: 18,
                }}
              >
                ×
              </button>
              <AgentChatInterface />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1023px) {
          .dash-rightpane { display: none; }
        }
        @media (min-width: 1024px) {
          .dash-rightpane-mobile, .dash-rightpane-mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardAgentPage() {
  const [active, setActive] = useState<SectionKey>('overview')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agentDrawerOpen, setAgentDrawerOpen] = useState(false)

  // Global ⌘K / Ctrl+K to toggle palette, Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setSidebarOpen(false)
        setAgentDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--df-bg-base)',
        color: 'var(--df-text-primary)',
        fontFamily: 'var(--df-font-sans, ui-sans-serif, system-ui, sans-serif)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <TopBar
        active={active}
        onOpenPalette={() => setPaletteOpen(true)}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          active={active}
          onSelect={setActive}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main style={{ flex: 1, minWidth: 0, padding: '28px 28px 48px', overflowY: 'auto' }}>
          {active === 'overview' && <OverviewPane />}
          {active === 'campaigns' && <PlaceholderPane label="Campaigns — full management view" />}
          {active === 'inbox-health' && <PlaceholderPane label="Inbox health — domain warmup, DMARC, blacklist checks" />}
          {active === 'agent' && <PlaceholderPane label="Agent — full chat history + run logs" />}
          {active === 'settings' && <PlaceholderPane label="Settings — workspace, billing, integrations" />}
        </main>

        <RightPane open={agentDrawerOpen} onClose={() => setAgentDrawerOpen(false)} />
      </div>

      {/* Mobile-only floating "talk to agent" FAB */}
      <button
        type="button"
        onClick={() => setAgentDrawerOpen(true)}
        aria-label="Open AI agent"
        className="dash-agent-fab"
        style={{
          position: 'fixed', right: 18, bottom: 18, zIndex: 25,
          width: 56, height: 56, borderRadius: 999, border: 0,
          background: 'var(--df-neon-violet)', color: '#000',
          fontSize: 22, fontWeight: 700, cursor: 'pointer',
          boxShadow: 'var(--df-glow-violet)',
        }}
      >
        ✦
      </button>

      <style>{`
        @media (min-width: 1024px) {
          .dash-agent-fab { display: none; }
        }
      `}</style>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
