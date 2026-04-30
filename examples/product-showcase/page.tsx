'use client'

/**
 * Darkforge — Product Showcase Demo
 * --------------------------------
 * `<ProductShowcase>` for "Nexus Aura" — a fictional AMOLED-dark wireless
 * earbud landing page built on React Three Fiber, framer-motion, and the DF
 * dark token system.
 *
 * Source caveat: authored from training-data recall (Jan 2026 cutoff). Live
 * doc tools (context7, WebFetch) are denied in this sandbox, so every
 * uncertain prop is tagged inline with `// VERIFY:`. Cross-check against:
 *   - r3f.docs.pmnd.rs           (Canvas, useFrame, useThree)
 *   - drei.docs.pmnd.rs          (Float, MeshDistortMaterial, Html prop tables)
 *   - threejs.org/docs           (geometry / material params, color-space)
 *   - @react-three/postprocessing README (Bloom mipmapBlur, ChromaticAberration)
 *
 * Targets: three@0.170+, @react-three/fiber@8.17+ (R3F v9 is beta — pin v8),
 * @react-three/drei@9.114+, @react-three/postprocessing@2.16+, motion@11+.
 *
 * The earbud is a placeholder — icosahedron + sphere stem. For production,
 * swap in a real glTF via drei's `useGLTF`. See the README in this folder.
 */

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing'
import { Vector2 } from 'three'
import * as THREE from 'three'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/* ============================================================
 * 1. Brand data — "Nexus Aura" wireless earbuds
 * ============================================================ */

const PRODUCT = {
  name: 'Nexus Aura',
  tagline: 'Studio-grade audio. Pocket-grade everything else.',
  eyebrow: 'DF-A1 · WIRELESS EARBUDS',
  description:
    'Custom 11mm dynamic drivers. Adaptive ANC tuned per ear. 38-hour battery life with the case. Engineered in Berlin, assembled responsibly.',
  price: 249,
  currency: 'USD',
  shippingNote: 'Free 2-day shipping in 32 countries.',
  warranty: '2-year limited warranty',
  preorderEta: 'Ships from May 14',
} as const

interface Feature {
  id: string
  eyebrow: string
  title: string
  body: string
  hue: 'violet' | 'cyan' | 'pink'
  graphic: 'orb' | 'rings' | 'mesh'
  reverse?: boolean
}

const FEATURES: Feature[] = [
  {
    id: 'driver',
    eyebrow: 'AURACORE DRIVER',
    title: 'Dual-magnet 11mm drivers, hand-tuned in Berlin.',
    body: 'A graphene-coated diaphragm drives 7 Hz to 40 kHz response with under 0.05% THD at reference volume. Mids stay forward; sub-bass stays where the artist put it.',
    hue: 'violet',
    graphic: 'orb',
  },
  {
    id: 'anc',
    eyebrow: 'ADAPTIVE ANC',
    title: 'Noise cancelling that knows your ear canal.',
    body: 'A 1.4 GHz neural co-processor profiles your fit every 200 ms and resamples the cancellation curve. 32 dB of attenuation in the cabin, transparency in the cafe.',
    hue: 'cyan',
    graphic: 'rings',
    reverse: true,
  },
  {
    id: 'battery',
    eyebrow: 'AURA BATTERY',
    title: '38 hours total. 10 minutes for a full day.',
    body: 'A 65 mAh cell per bud and a 580 mAh case mean 9 hours of ANC playback per charge — and a ten-minute fast charge unlocks another 8. USB-C and Qi wireless out of the box.',
    hue: 'pink',
    graphic: 'mesh',
  },
]

interface SpecRow {
  label: string
  value: string
  detail?: string
}

const SPECS: SpecRow[] = [
  { label: 'Drivers', value: '11 mm dynamic', detail: 'Graphene + LCP composite diaphragm' },
  { label: 'Frequency response', value: '7 Hz — 40 kHz', detail: 'Hi-Res Audio Wireless certified' },
  { label: 'Bluetooth', value: '5.4 LE Audio', detail: 'Multipoint to 3 devices · LC3 + aptX Lossless' },
  { label: 'Weight per bud', value: '4.6 g', detail: 'Charging case 38 g (without buds)' },
  { label: 'Battery (bud)', value: '9 h ANC on', detail: '11 h ANC off · 65 mAh per side' },
  { label: 'Battery (total)', value: '38 h with case', detail: '580 mAh · USB-C PD + Qi 7.5 W' },
  { label: 'ANC depth', value: '32 dB peak', detail: '6 mics · 1.4 GHz adaptive co-processor' },
  { label: 'Microphones', value: '6 (3 per side)', detail: 'Beam-formed voice · ENC for calls' },
  { label: 'Water + dust', value: 'IP57 (bud) / IPX4 (case)', detail: 'Sweat, rain, and gym-bag safe' },
  { label: 'Codecs', value: 'LC3 · aptX Lossless · AAC · SBC', detail: 'Auto-fallback per device' },
  { label: 'In the box', value: 'Buds · Case · 4 ear tips · USB-C', detail: 'Memory-foam tips XS / S / M / L' },
  { label: 'Materials', value: 'Recycled aluminum + bio-resin', detail: '94% post-consumer content by mass' },
]

const ACCESSORIES = [
  {
    id: 'case-leather',
    name: 'Aura Case · Vegan Leather',
    price: 49,
    description: 'Magnetic snap, MagSafe-aligned coil, dyed in three matte tones.',
  },
  {
    id: 'tips',
    name: 'Memory-Foam Tips Pack',
    price: 19,
    description: 'Six pairs · XS to XL · noise isolation +4 dB over silicone.',
  },
  {
    id: 'cable',
    name: 'Braided USB-C Cable',
    price: 24,
    description: '1.2 m · 100 W PD · matte violet braid with EMI shielding.',
  },
] as const

/* ============================================================
 * 2. Helpers — color mapping, easings
 * ============================================================ */

type NxHue = 'violet' | 'cyan' | 'pink'

/** WebGL hex literals — only used inside Three.js scene code, never DOM. */
const NX_HEX: Record<NxHue, number> = {
  violet: 0xa78bfa,
  cyan: 0x22d3ee,
  pink: 0xf472b6,
}

/** CSS variable names for DOM use — never inlines a hex value. */
const NX_VAR: Record<NxHue, string> = {
  violet: 'var(--df-neon-violet)',
  cyan: 'var(--df-neon-cyan)',
  pink: 'var(--df-neon-pink)',
}

const NX_GLOW: Record<NxHue, string> = {
  violet: '0 0 60px rgba(167,139,250,0.25)',
  cyan: '0 0 60px rgba(34,211,238,0.22)',
  pink: '0 0 60px rgba(244,114,182,0.20)',
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ============================================================
 * 3. <Hero3D /> — R3F Canvas with rotating earbud + headline
 * ============================================================ */

function EarbudModel() {
  const groupRef = useRef<THREE.Group>(null)
  const reduce = useReducedMotion()

  useFrame((state, delta) => {
    if (reduce || !groupRef.current) return
    // Slow auto-rotate plus subtle pointer parallax
    groupRef.current.rotation.y += delta * 0.22
    const targetX = state.pointer.y * 0.18
    const targetZ = state.pointer.x * 0.18
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.06,
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.06,
    )
  })

  return (
    <group ref={groupRef}>
      {/*
        PLACEHOLDER GEOMETRY. Production swap:
        const { nodes } = useGLTF('/models/nexus-aura.glb')
        and render <primitive object={nodes.earbud} />
      */}

      {/* Bud — distorted icosahedron, violet emissive */}
      <Float floatIntensity={0.6} rotationIntensity={0.2} speed={1.2}>
        <mesh position={[0, 0.15, 0]}>
          <icosahedronGeometry args={[1.05, 6]} />
          <MeshDistortMaterial
            color={new THREE.Color(NX_HEX.violet)}
            emissive={new THREE.Color(NX_HEX.violet)}
            emissiveIntensity={1.6}
            metalness={0.45}
            roughness={0.18}
            distort={0.22} /* VERIFY: drei MeshDistortMaterial prop name */
            speed={1.4}
            toneMapped={false}
          />
        </mesh>

        {/* Stem — small sphere offset below the bud */}
        <mesh position={[0.05, -0.95, 0.18]}>
          <sphereGeometry args={[0.32, 48, 48]} />
          <meshStandardMaterial
            color={new THREE.Color(0x0a0a0a)}
            emissive={new THREE.Color(NX_HEX.cyan)}
            emissiveIntensity={0.4}
            metalness={0.85}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Tip — micro torus suggesting the silicone fitting */}
        <mesh position={[-0.78, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2.2]}>
          <torusGeometry args={[0.35, 0.12, 24, 64]} />
          <meshStandardMaterial
            color={new THREE.Color(0x111111)}
            roughness={0.55}
            metalness={0.05}
            toneMapped
          />
        </mesh>
      </Float>

      {/* Soft halo plane behind the bud */}
      <mesh position={[0, 0, -1.2]} rotation={[0, 0, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(NX_HEX.violet)}
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function PulseRimLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const reduce = useReducedMotion()

  useFrame((state) => {
    if (!lightRef.current) return
    const t = reduce ? 0 : state.clock.elapsedTime
    lightRef.current.intensity = 1.1 + Math.sin(t * 1.2) * 0.4
  })

  return (
    <pointLight
      ref={lightRef}
      position={[-3, 2, 3]}
      color={new THREE.Color(NX_HEX.violet)}
      distance={18}
    />
  )
}

function Hero3D() {
  const reduce = useReducedMotion()
  const dpr = useMemo<[number, number]>(() => [1, 2], [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--df-bg-base)',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* Ambient gradient orbs behind the canvas */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 'min(620px, 70vw)',
          aspectRatio: '1',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: 'min(540px, 60vw)',
          aspectRatio: '1',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* WebGL canvas — decorative, aria-hidden */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none', // overlay UI must stay clickable
        }}
      >
        <Canvas
          dpr={dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 4.6], fov: 38, near: 0.1, far: 50 }}
          frameloop={reduce ? 'demand' : 'always'}
          aria-hidden="true"
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={0.7}
            color={new THREE.Color(0xffffff)}
          />
          <PulseRimLight />

          <Suspense fallback={null}>
            <EarbudModel />
          </Suspense>

          <EffectComposer enableNormalPass={false}>
            <Bloom
              intensity={1.05}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.9}
              mipmapBlur /* VERIFY: postprocessing v6 prop */
            />
            <ChromaticAberration
              offset={new Vector2(0.0006, 0.0009)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.22} darkness={0.85} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* DOM overlay — uses DF tokens, sits above the canvas */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 64px)',
          display: 'grid',
          gap: 'var(--df-space-12)',
          minHeight: '100vh',
          alignContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ display: 'inline-flex', alignSelf: 'flex-start' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 'var(--df-radius-full)',
              background: 'rgba(167,139,250,0.10)',
              border: '1px solid rgba(167,139,250,0.25)',
              color: 'var(--df-neon-violet)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.08em',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--df-neon-violet)',
                boxShadow: 'var(--df-glow-violet)',
              }}
            />
            {PRODUCT.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 }}
          style={{
            margin: 0,
            fontFamily: 'var(--df-font-display)',
            color: 'var(--df-text-primary)',
            fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
          }}
        >
          {PRODUCT.tagline.split('. ')[0]}.
          <br />
          <span
            style={{
              background:
                'linear-gradient(135deg, var(--df-neon-violet), var(--df-neon-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {PRODUCT.tagline.split('. ')[1]}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
          style={{
            margin: 0,
            color: 'var(--df-text-secondary)',
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            lineHeight: 1.65,
            maxWidth: '52ch',
          }}
        >
          {PRODUCT.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
          style={{
            display: 'flex',
            gap: 'var(--df-space-3)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <PrimaryCTA
            href="#preorder"
            label={`Pre-order — $${PRODUCT.price}`}
          />
          <SecondaryCTA href="#specs" label="Read the specs" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{
            margin: 0,
            color: 'var(--df-text-muted)',
            fontSize: 13,
          }}
        >
          {PRODUCT.preorderEta} · {PRODUCT.shippingNote}
        </motion.p>
      </div>
    </section>
  )
}

/* ============================================================
 * 4. CTA buttons (shared)
 * ============================================================ */

function PrimaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, boxShadow: '0 0 36px rgba(167,139,250,0.45)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 24px',
        background: 'var(--df-neon-violet)',
        color: 'var(--df-text-inverse)',
        borderRadius: 'var(--df-radius-full)',
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
        boxShadow: 'var(--df-glow-violet)',
      }}
    >
      {label}
      <span aria-hidden="true">→</span>
    </motion.a>
  )
}

function SecondaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.18)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '14px 22px',
        background: 'var(--df-glass-bg)',
        color: 'var(--df-text-primary)',
        border: '1px solid var(--df-glass-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 'var(--df-radius-full)',
        fontWeight: 500,
        fontSize: 15,
        textDecoration: 'none',
      }}
    >
      {label}
    </motion.a>
  )
}

/* ============================================================
 * 5. Feature graphics — small standalone R3F canvases
 * ============================================================ */

interface FeatureCanvasProps {
  hue: NxHue
  variant: Feature['graphic']
}

function FeatureGraphicMesh({ hue, variant }: FeatureCanvasProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const reduce = useReducedMotion()

  useFrame((_, delta) => {
    if (reduce) return
    if (variant === 'rings' && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
      groupRef.current.rotation.x += delta * 0.18
      return
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
      if (variant === 'mesh') meshRef.current.rotation.x += delta * 0.18
    }
  })

  if (variant === 'orb') {
    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.0, 5]} />
        <MeshDistortMaterial
          color={new THREE.Color(NX_HEX[hue])}
          emissive={new THREE.Color(NX_HEX[hue])}
          emissiveIntensity={1.4}
          metalness={0.4}
          roughness={0.22}
          distort={0.32}
          speed={1.2}
          toneMapped={false}
        />
      </mesh>
    )
  }

  if (variant === 'rings') {
    return (
      <group ref={groupRef}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[Math.PI / 2.5 + i * 0.4, i * 0.6, 0]}
            scale={1 - i * 0.18}
          >
            <torusGeometry args={[1, 0.04, 32, 128]} />
            <meshStandardMaterial
              color={new THREE.Color(NX_HEX[hue])}
              emissive={new THREE.Color(NX_HEX[hue])}
              emissiveIntensity={1.2 - i * 0.2}
              roughness={0.3}
              metalness={0.5}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    )
  }

  // 'mesh' — torus knot
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.85, 0.22, 180, 28, 2, 3]} />
      <meshStandardMaterial
        color={new THREE.Color(NX_HEX[hue])}
        emissive={new THREE.Color(NX_HEX[hue])}
        emissiveIntensity={1.0}
        roughness={0.3}
        metalness={0.5}
        toneMapped={false}
      />
    </mesh>
  )
}

function FeatureCanvas({ hue, variant }: FeatureCanvasProps) {
  const reduce = useReducedMotion()
  const dpr = useMemo<[number, number]>(() => [1, 2], [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        background: 'var(--df-bg-surface)',
        border: '1px solid var(--df-border-subtle)',
        borderRadius: 'var(--df-radius-xl)',
        overflow: 'hidden',
        boxShadow: NX_GLOW[hue],
      }}
    >
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        frameloop={reduce ? 'demand' : 'always'}
        aria-hidden="true"
      >
        <ambientLight intensity={0.4} />
        <pointLight
          position={[2, 2, 4]}
          intensity={1.2}
          color={new THREE.Color(NX_HEX[hue])}
          distance={14}
        />
        <directionalLight position={[-3, 2, 2]} intensity={0.5} />

        <Suspense fallback={null}>
          <Float floatIntensity={0.4} rotationIntensity={0.3} speed={1.0}>
            <FeatureGraphicMesh hue={hue} variant={variant} />
          </Float>
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.3} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

/* ============================================================
 * 6. <FeaturesSpotlight /> — alternating image + text rows
 * ============================================================ */

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const reverse = feature.reverse
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 * index }}
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(24px, 5vw, 64px)',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          order: reverse ? 2 : 1,
        }}
      >
        <FeatureCanvas hue={feature.hue} variant={feature.graphic} />
      </div>
      <div style={{ order: reverse ? 1 : 2, display: 'grid', gap: 'var(--df-space-4)' }}>
        <span
          style={{
            color: NX_VAR[feature.hue],
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {feature.eyebrow}
        </span>
        <h3
          style={{
            margin: 0,
            color: 'var(--df-text-primary)',
            fontFamily: 'var(--df-font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: 'var(--df-text-secondary)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.0625rem)',
            lineHeight: 1.65,
            maxWidth: '52ch',
          }}
        >
          {feature.body}
        </p>
      </div>
    </motion.article>
  )
}

function FeaturesSpotlight() {
  return (
    <section
      id="features"
      style={{
        position: 'relative',
        background: 'var(--df-bg-base)',
        padding: 'clamp(80px, 14vh, 160px) clamp(20px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ marginBottom: 'clamp(48px, 8vh, 96px)', maxWidth: 720 }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--df-neon-violet)',
              fontSize: 12,
              letterSpacing: '0.12em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            What is inside
          </p>
          <h2
            style={{
              margin: '12px 0 0',
              color: 'var(--df-text-primary)',
              fontFamily: 'var(--df-font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Three pieces of engineering, working as one.
          </h2>
        </motion.header>

        <div
          style={{
            display: 'grid',
            gap: 'clamp(64px, 12vh, 144px)',
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureRow key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
 * 7. <SpecsTable /> — dark spec table
 * ============================================================ */

const tableContainerStyle: CSSProperties = {
  background: 'var(--df-bg-surface)',
  border: '1px solid var(--df-border-default)',
  borderRadius: 'var(--df-radius-xl)',
  overflow: 'hidden',
}

function SpecsTable() {
  return (
    <section
      id="specs"
      style={{
        position: 'relative',
        background: 'var(--df-bg-base)',
        padding: 'clamp(80px, 14vh, 140px) clamp(20px, 5vw, 64px)',
        borderTop: '1px solid var(--df-border-subtle)',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ marginBottom: 'clamp(32px, 6vh, 64px)' }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--df-neon-cyan)',
              fontSize: 12,
              letterSpacing: '0.12em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Tech Specs
          </p>
          <h2
            style={{
              margin: '12px 0 0',
              color: 'var(--df-text-primary)',
              fontFamily: 'var(--df-font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
            }}
          >
            Every measurable thing about the Aura.
          </h2>
        </motion.header>

        {/* Scoped responsive rules for the spec table */}
        <style>{`
          @media (min-width: 720px) {
            .nx-spec-row {
              grid-template-columns: 220px 1fr 2fr !important;
              gap: var(--df-space-6) !important;
              align-items: baseline !important;
            }
            .nx-spec-detail {
              text-align: right;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          style={tableContainerStyle}
        >
          <dl
            style={{
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: '1fr',
            }}
          >
            {SPECS.map((row, i) => (
              <SpecRowItem key={row.label} row={row} index={i} />
            ))}
          </dl>
        </motion.div>

        <p
          style={{
            margin: 'var(--df-space-6) 0 0',
            color: 'var(--df-text-muted)',
            fontSize: 13,
          }}
        >
          Specifications subject to refinement before mass production.{' '}
          {PRODUCT.warranty}.
        </p>
      </div>
    </section>
  )
}

function SpecRowItem({ row, index }: { row: SpecRow; index: number }) {
  const isLast = index === SPECS.length - 1
  return (
    <div
      style={{
        padding: 'var(--df-space-5) var(--df-space-6)',
        borderBottom: isLast ? 'none' : '1px solid var(--df-border-subtle)',
      }}
    >
      <div
        className="nx-spec-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--df-space-1)',
        }}
      >
        <dt
          style={{
            color: 'var(--df-text-muted)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {row.label}
        </dt>
        <dd
          style={{
            margin: 0,
            color: 'var(--df-text-primary)',
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'var(--df-font-mono)',
          }}
        >
          {row.value}
        </dd>
        {row.detail && (
          <dd
            className="nx-spec-detail"
            style={{
              margin: 0,
              color: 'var(--df-text-secondary)',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {row.detail}
          </dd>
        )}
      </div>
    </div>
  )
}

/* ============================================================
 * 8. <Pricing /> — single product + accessories with hover glow
 * ============================================================ */

function PricingCard({
  title,
  price,
  description,
  primary,
  badge,
}: {
  title: string
  price: number
  description: string
  primary?: boolean
  badge?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      tabIndex={0}
      style={{
        position: 'relative',
        padding: 'var(--df-space-8)',
        background: primary
          ? 'linear-gradient(180deg, rgba(167,139,250,0.08) 0%, var(--df-bg-surface) 100%)'
          : 'var(--df-bg-surface)',
        border: primary
          ? '1px solid rgba(167,139,250,0.35)'
          : '1px solid var(--df-border-default)',
        borderRadius: 'var(--df-radius-xl)',
        boxShadow: hovered
          ? '0 0 40px rgba(167,139,250,0.30), 0 24px 64px rgba(0,0,0,0.45)'
          : primary
            ? '0 0 24px rgba(167,139,250,0.15)'
            : '0 8px 24px rgba(0,0,0,0.35)',
        outline: 'none',
        transition:
          'box-shadow var(--df-duration-base) var(--df-ease-out), border-color var(--df-duration-base) var(--df-ease-out)',
        display: 'grid',
        gap: 'var(--df-space-4)',
      }}
    >
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            left: 24,
            background: 'var(--df-neon-violet)',
            color: 'var(--df-text-inverse)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 'var(--df-radius-full)',
            boxShadow: 'var(--df-glow-violet)',
          }}
        >
          {badge}
        </span>
      )}

      <h3
        style={{
          margin: 0,
          color: 'var(--df-text-primary)',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--df-font-display)',
            color: 'var(--df-text-primary)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          ${price}
        </span>
        <span style={{ color: 'var(--df-text-muted)', fontSize: 13 }}>USD</span>
      </div>
      <p
        style={{
          margin: 0,
          color: 'var(--df-text-secondary)',
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      <a
        href="#preorder"
        style={{
          marginTop: 'var(--df-space-2)',
          padding: '12px 20px',
          textAlign: 'center',
          textDecoration: 'none',
          background: primary ? 'var(--df-neon-violet)' : 'var(--df-bg-elevated)',
          color: primary ? 'var(--df-text-inverse)' : 'var(--df-text-primary)',
          border: primary
            ? 'none'
            : '1px solid var(--df-border-default)',
          borderRadius: 'var(--df-radius-md)',
          fontWeight: 600,
          fontSize: 14,
          boxShadow: primary ? 'var(--df-glow-violet)' : 'none',
        }}
      >
        {primary ? 'Pre-order now' : 'Add to bundle'}
      </a>
    </motion.div>
  )
}

function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        background: 'var(--df-bg-base)',
        padding: 'clamp(80px, 14vh, 140px) clamp(20px, 5vw, 64px)',
        borderTop: '1px solid var(--df-border-subtle)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ marginBottom: 'clamp(48px, 8vh, 80px)', textAlign: 'center' }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--df-neon-pink)',
              fontSize: 12,
              letterSpacing: '0.12em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            One price. No subscriptions.
          </p>
          <h2
            style={{
              margin: '12px 0 0',
              color: 'var(--df-text-primary)',
              fontFamily: 'var(--df-font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Build your Aura.
          </h2>
        </motion.header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'var(--df-space-6)',
          }}
        >
          <PricingCard
            title={`${PRODUCT.name} (DF-A1)`}
            price={PRODUCT.price}
            description="The earbuds and charging case. 38-hour total battery, IP57, USB-C + Qi wireless. Free 2-day shipping."
            primary
            badge="Pre-order"
          />
          {ACCESSORIES.map((acc) => (
            <PricingCard
              key={acc.id}
              title={acc.name}
              price={acc.price}
              description={acc.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
 * 9. <CTA /> — closing pre-order block
 * ============================================================ */

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

function CTA() {
  return (
    <section
      id="preorder"
      style={{
        position: 'relative',
        background: 'var(--df-bg-base)',
        padding: 'clamp(80px, 16vh, 160px) clamp(20px, 5vw, 64px)',
        borderTop: '1px solid var(--df-border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Glow orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(900px, 90vw)',
          aspectRatio: '1',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        variants={ctaVariants}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 760,
          margin: '0 auto',
          textAlign: 'center',
          display: 'grid',
          gap: 'var(--df-space-6)',
          background: 'var(--df-glass-bg-md)',
          border: '1px solid var(--df-border-default)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--df-radius-2xl)',
          padding: 'clamp(40px, 8vh, 80px) clamp(24px, 5vw, 64px)',
          boxShadow:
            '0 32px 96px rgba(0,0,0,0.55), 0 0 60px rgba(167,139,250,0.14)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: 'var(--df-neon-violet)',
            fontSize: 12,
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          Limited first run
        </p>
        <h2
          style={{
            margin: 0,
            color: 'var(--df-text-primary)',
            fontFamily: 'var(--df-font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Pre-order the Nexus Aura.
        </h2>
        <p
          style={{
            margin: 0,
            color: 'var(--df-text-secondary)',
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            lineHeight: 1.65,
            maxWidth: '52ch',
            justifySelf: 'center',
          }}
        >
          A $50 deposit reserves your pair from the first batch. Full balance
          charges on dispatch. Cancel anytime before your unit ships.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--df-space-3)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 'var(--df-space-2)',
          }}
        >
          <PrimaryCTA
            href="#"
            label={`Reserve for $50 · ${PRODUCT.preorderEta}`}
          />
          <SecondaryCTA href="#features" label="Re-read the features" />
        </div>
        <p
          style={{
            margin: 0,
            color: 'var(--df-text-muted)',
            fontSize: 12,
          }}
        >
          {PRODUCT.warranty} · 30-day return window once delivered
        </p>
      </motion.div>
    </section>
  )
}

/* ============================================================
 * 10. <ProductShowcase /> — root composition
 * ============================================================ */

interface ProductShowcaseProps {
  /** Optional className to merge onto the outer wrapper for consumers. */
  className?: string
  /** Children render below the CTA — useful for footers in the host app. */
  children?: ReactNode
}

export default function ProductShowcase({
  className,
  children,
}: ProductShowcaseProps) {
  // Inject DF tokens into the page when this component mounts. In a real app
  // these live in a global stylesheet — this fallback keeps the demo
  // self-contained when dropped into a fresh project.
  useDfTokens()

  return (
    <main
      className={className}
      style={{
        background: 'var(--df-bg-base)',
        color: 'var(--df-text-primary)',
        fontFamily: 'var(--df-font-sans)',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <Hero3D />
      <FeaturesSpotlight />
      <SpecsTable />
      <Pricing />
      <CTA />
      {children}
    </main>
  )
}

/* ============================================================
 * 11. DF token bootstrap — injects :root vars once
 *     (delete in projects that already ship the token system globally)
 * ============================================================ */

const NX_TOKEN_CSS = `
:root {
  --df-bg-base:       #000000;
  --df-bg-surface:    #080808;
  --df-bg-elevated:   #111111;
  --df-bg-overlay:    #1a1a1a;
  --df-bg-muted:      #222222;
  --df-bg-hover:      #2a2a2a;

  --df-neon-violet:   #a78bfa;
  --df-neon-cyan:     #22d3ee;
  --df-neon-pink:     #f472b6;
  --df-neon-green:    #4ade80;
  --df-neon-amber:    #fbbf24;
  --df-neon-red:      #f87171;

  --df-glow-violet:    0 0 20px rgba(167, 139, 250, 0.35);
  --df-glow-violet-lg: 0 0 40px rgba(167, 139, 250, 0.25);
  --df-glow-cyan:      0 0 20px rgba(34, 211, 238, 0.35);
  --df-glow-pink:      0 0 20px rgba(244, 114, 182, 0.35);
  --df-glow-green:     0 0 20px rgba(74, 222, 128, 0.35);

  --df-glass-bg:       rgba(255, 255, 255, 0.04);
  --df-glass-bg-md:    rgba(255, 255, 255, 0.07);
  --df-glass-bg-lg:    rgba(255, 255, 255, 0.10);
  --df-glass-border:   rgba(255, 255, 255, 0.08);
  --df-glass-border-md: rgba(255, 255, 255, 0.12);

  --df-text-primary:   #ffffff;
  --df-text-secondary: #a1a1aa;
  --df-text-muted:     #52525b;
  --df-text-inverse:   #000000;
  --df-text-accent:    #a78bfa;

  --df-border-subtle:  rgba(255, 255, 255, 0.05);
  --df-border-default: rgba(255, 255, 255, 0.09);
  --df-border-strong:  rgba(255, 255, 255, 0.16);
  --df-border-focus:   rgba(167, 139, 250, 0.5);

  --df-radius-xs:   4px;
  --df-radius-sm:   6px;
  --df-radius-md:   10px;
  --df-radius-lg:   16px;
  --df-radius-xl:   24px;
  --df-radius-2xl:  32px;
  --df-radius-full: 9999px;

  --df-space-1:  4px;
  --df-space-2:  8px;
  --df-space-3:  12px;
  --df-space-4:  16px;
  --df-space-5:  20px;
  --df-space-6:  24px;
  --df-space-8:  32px;
  --df-space-10: 40px;
  --df-space-12: 48px;
  --df-space-16: 64px;

  --df-font-sans:    'Inter', 'Geist', system-ui, sans-serif;
  --df-font-mono:    'JetBrains Mono', 'Fira Code', monospace;
  --df-font-display: 'Cal Sans', 'Inter', sans-serif;

  --df-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --df-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --df-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --df-duration-fast:   150ms;
  --df-duration-base:   250ms;
  --df-duration-slow:   400ms;
}
`

function useDfTokens() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const id = 'df-tokens-product-showcase'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = NX_TOKEN_CSS
    document.head.appendChild(style)
    // Note: deliberately not removed on unmount — multiple demos may share
    // the tokens. If scoped cleanup is needed, remove by id here.
  }, [])
}

/* ============================================================
 * 12. Optional named exports — lets host apps pick a single section
 * ============================================================ */

export {
  Hero3D,
  FeaturesSpotlight,
  SpecsTable,
  Pricing,
  CTA,
  PRODUCT,
  FEATURES,
  SPECS,
  ACCESSORIES,
}

/* End of product-showcase/page.tsx */
