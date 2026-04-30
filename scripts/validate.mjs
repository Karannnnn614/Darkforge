#!/usr/bin/env node
// =============================================================================
// Darkforge plugin validator
// -----------------------------------------------------------------------------
// Deterministic CI gate. Runs all of:
//   1. plugin.json + marketplace.json parse + required-field check
//   2. SKILL.md frontmatter — only recognized Claude Code keys allowed
//   3. Every reference path in the SKILL.md routing table resolves to a real file
//   4. Long reference docs include a top-level Contents block for easier Skill loading
//   5. examples/*.tsx don't have hardcoded hex outside known-good zones
//
// Exit 0 = ship it. Exit 1 = fix before pushing.
//
// Usage: node scripts/validate.mjs
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []

function err(msg) { errors.push(msg) }
function warn(msg) { warnings.push(msg) }

// ---------------------------------------------------------------------------
// 1. JSON manifests
// ---------------------------------------------------------------------------

function readJson(rel) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) { err(`missing: ${rel}`); return null }
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) }
  catch (e) { err(`${rel}: invalid JSON — ${e.message}`); return null }
}

const plugin = readJson('.claude-plugin/plugin.json')
const marketplace = readJson('.claude-plugin/marketplace.json')

if (plugin) {
  if (!plugin.name) err('plugin.json: missing required "name"')
  if (!plugin.description) err('plugin.json: missing required "description"')
  if (plugin.name && !/^[a-z0-9-]+$/.test(plugin.name)) {
    err(`plugin.json: name "${plugin.name}" must be lowercase letters/numbers/hyphens only`)
  }
}

if (marketplace) {
  if (!marketplace.name) err('marketplace.json: missing required "name"')
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    err('marketplace.json: plugins[] must be a non-empty array')
  }
  if (plugin && marketplace.plugins?.[0]?.name !== plugin.name) {
    err(`marketplace.json plugins[0].name (${marketplace.plugins?.[0]?.name}) must equal plugin.json name (${plugin.name})`)
  }
}

// ---------------------------------------------------------------------------
// 2. SKILL.md frontmatter — recognized keys per code.claude.com/docs/en/skills
// ---------------------------------------------------------------------------

const RECOGNIZED_FRONTMATTER = new Set([
  'name', 'description', 'when_to_use', 'argument-hint', 'arguments',
  'disable-model-invocation', 'user-invocable', 'allowed-tools',
  'model', 'effort', 'context', 'agent', 'hooks', 'paths', 'shell',
])

const skillPath = path.join(ROOT, 'skills/forge/SKILL.md')
let skillMd = ''
if (!fs.existsSync(skillPath)) {
  err('missing: skills/forge/SKILL.md')
} else {
  skillMd = fs.readFileSync(skillPath, 'utf8')
  const m = skillMd.match(/^---\n([\s\S]*?)\n---/)
  if (!m) {
    err('SKILL.md: missing YAML frontmatter')
  } else {
    const keys = m[1].split('\n')
      .map((l) => l.match(/^([A-Za-z0-9_-]+)\s*:/)?.[1])
      .filter(Boolean)
    for (const k of keys) {
      if (!RECOGNIZED_FRONTMATTER.has(k)) {
        err(`SKILL.md frontmatter: "${k}" is not a recognized field — see code.claude.com/docs/en/skills`)
      }
    }
    if (!keys.includes('description')) {
      warn('SKILL.md: no "description" — Claude won\'t know when to auto-invoke')
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Routing-table references in SKILL.md must resolve
// ---------------------------------------------------------------------------

const SKILL_DIR = path.join(ROOT, 'skills/forge')
const refMatches = [...skillMd.matchAll(/`(references\/[\w./-]+\.md)`/g)].map((m) => m[1])
const seen = new Set()
for (const ref of refMatches) {
  if (seen.has(ref)) continue
  seen.add(ref)
  const abs = path.join(SKILL_DIR, ref)
  if (!fs.existsSync(abs)) {
    err(`SKILL.md routes to ${ref} but file does not exist`)
  }
}

// Flag references on disk that the routing table never mentions
const refsDir = path.join(SKILL_DIR, 'references')
if (fs.existsSync(refsDir)) {
  for (const f of fs.readdirSync(refsDir)) {
    if (!f.endsWith('.md')) continue
    const rel = `references/${f}`
    if (!seen.has(rel) && !rel.includes('patterns')) {
      warn(`${rel} exists but no routing-table entry references it`)
    }
  }
  const patternsDir = path.join(refsDir, 'patterns')
  if (fs.existsSync(patternsDir)) {
    for (const f of fs.readdirSync(patternsDir)) {
      if (!f.endsWith('.md')) continue
      const rel = `references/patterns/${f}`
      if (!seen.has(rel)) {
        warn(`${rel} exists but no routing-table entry references it`)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Long reference docs should include Contents near the top
// ---------------------------------------------------------------------------

function walkMd(dir) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walkMd(p))
    else if (ent.name.endsWith('.md')) out.push(p)
  }
  return out
}

for (const p of walkMd(refsDir)) {
  const rel = path.relative(ROOT, p)
  const src = fs.readFileSync(p, 'utf8')
  const lines = src.split('\n')
  const head = lines.slice(0, Math.min(lines.length, 80)).join('\n')
  if (lines.length > 100 && !/^## Contents$/m.test(head)) {
    warn(`${rel}: ${lines.length} lines but no "## Contents" block in the first 80 lines`)
  }
}

// ---------------------------------------------------------------------------
// 5. Hardcoded-hex scan in examples/*.tsx
//    Allowed: common black/white shorthands, Three.js / WebGL color args
//    (color={0x...} or new THREE.Color('#...')), and DF token definition blocks.
// ---------------------------------------------------------------------------

const ALLOWED_HEX = new Set([
  '#000', '#fff',           // common shorthand
  '#000000', '#ffffff',     // common longhand
])
const HEX_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g

function scanFile(rel) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) return
  const src = fs.readFileSync(p, 'utf8')
  const lines = src.split('\n')
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return
    // Skip lines that are clearly inside a Three.js color call
    if (/THREE\.Color|color=\{0x|new\s+Color\b/.test(line)) return
    // Token definitions are the source of truth and must contain literal values.
    if (/^--df-[\w-]+\s*:/.test(trimmed)) return
    const matches = line.match(HEX_RE)
    if (!matches) return
    for (const hex of matches) {
      if (ALLOWED_HEX.has(hex.toLowerCase())) continue
      warn(`${rel}:${i + 1} hardcoded hex ${hex} — consider var(--df-*) token`)
    }
  })
}

const examplesDir = path.join(ROOT, 'examples')
if (fs.existsSync(examplesDir)) {
  for (const example of fs.readdirSync(examplesDir)) {
    const p = path.join('examples', example, 'page.tsx')
    if (fs.existsSync(path.join(ROOT, p))) scanFile(p)
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

if (warnings.length) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`)
  for (const w of warnings) console.log(`  • ${w}`)
}

if (errors.length) {
  console.log(`\n${errors.length} error${errors.length === 1 ? '' : 's'}:`)
  for (const e of errors) console.log(`  ✗ ${e}`)
  console.log('\nFAIL — fix errors before publishing.\n')
  process.exit(1)
}

console.log(`\nOK — ${seen.size} routing-table refs resolved, ${warnings.length} warnings.\n`)
process.exit(0)
