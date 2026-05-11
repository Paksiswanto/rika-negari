'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Perumahan, Tipe } from '@/data/properties'

// ── Types ────────────────────────────────────────────────────
interface Props {
  tipe        : Tipe
  perumahan   : Perumahan
  colorIndex? : number
}

// ── Constants ────────────────────────────────────────────────
const badgeClass: Record<string, string> = {
  'Ready Stock': 'badge-ready',
  'Inden'      : 'badge-inden',
  'Best Seller': 'badge-best',
  'Premium'    : 'badge-premium',
}

const ciClass     = ['ci-1', 'ci-2', 'ci-3']
const houseColors = ['#17c055', '#16bba7', '#2ec218']
const CLOUD_NAME  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function cldCard(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_600,h_450,c_fill,f_auto,q_80/${publicId}`
}

function HouseIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 170" fill="none" width="55%" aria-hidden>
      <rect x="30"  y="68"  width="140" height="96" stroke={color} strokeWidth="1.2" />
      <path d="M20 68L100 18L180 68"                 stroke={color} strokeWidth="1.2" />
      <rect x="75"  y="116" width="45"  height="48" stroke={color} strokeWidth="1"   />
      <rect x="40"  y="90"  width="30"  height="24" stroke={color} strokeWidth="0.8" />
      <rect x="130" y="90"  width="30"  height="24" stroke={color} strokeWidth="0.8" />
    </svg>
  )
}

// ── Main component ───────────────────────────────────────────
export default function PropertyCard({ tipe, perumahan, colorIndex = 0 }: Props) {
  const [saved, setSaved] = useState(false)
  const [saveHover, setSaveHover] = useState(false)

  if (!perumahan) return null;

  const ci         = ciClass[colorIndex % 3]
  const houseColor = houseColors[colorIndex % 3]
  
  const detailHref = `/properti/${perumahan.slug}/${tipe.slug}`
  const firstPhoto = tipe.galeri
    ?.sort((a, b) => a.urutan - b.urutan)?.[0]?.url ?? ''
  return (
    <div className="prop-card">
      {/* Image Section */}
      <div
        className={ci}
        style={{ height: 290, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {firstPhoto ? (
          <Image
            src={cldCard(firstPhoto)}
            alt={tipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            unoptimized={process.env.NODE_ENV === 'development'} // Mempercepat development di Infinix-mu
          />
        ) : (
          <HouseIcon color={houseColor} />
        )}
        <span
          className={`badge ${badgeClass[tipe.badge] ?? 'badge-ready'}`}
          style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}
        >
          {tipe.badge}
        </span>
      </div>

      {/* Body Section */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray900)', marginBottom: '0.2rem' }}>
          {tipe.name}
        </div>
        
        {/* Nama Perumahan menggunakan data yang dilempar langsung */}
        <div style={{ fontSize: '0.72rem', color: 'var(--p3)', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {perumahan.name}
        </div>

        {/* Specs */}
        <div className="spec-row" style={{ marginBottom: '1rem' }}>
          {[
            { val: `${tipe.lb} m²`, key: 'LB' },
            { val: `${tipe.lt} m²`, key: 'LT' },
            { val: String(tipe.kt), key: 'KT' },
            { val: String(tipe.km), key: 'KM' },
          ].map((s) => (
            <div key={s.key} className="spec-item">
              <div className="spec-val">{s.val}</div>
              <div className="spec-key">{s.key}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--p2)', marginBottom: '1rem' }}>
          {tipe.harga}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link
            href={detailHref}
            className="btn-primary"
            style={{ flex: 1, textAlign: 'center', padding: '0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Lihat Detail
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); setSaved(!saved) }}
            onMouseEnter={() => setSaveHover(true)}
            onMouseLeave={() => setSaveHover(false)}
            style={{
              background : saved || saveHover ? 'var(--plight)' : 'var(--gray100)',
              color      : saved || saveHover ? 'var(--p3)'    : 'var(--gray500)',
              padding    : '0.65rem 0.85rem',
              fontSize   : '0.85rem',
              border     : 'none',
              borderRadius: 100,
              cursor     : 'pointer',
              transition : 'all 0.2s',
            }}
          >
            {saved ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  )
}
