'use client'

import { useState } from 'react'

const galleryItems = [
  { id: 1, label: 'Eksterior',     color: '#17c055', bg: 'var(--plight)', colSpan: true,  rowSpan: false },
  { id: 2, label: 'Ruang Tamu',   color: '#16bba7', bg: 'var(--slight)', colSpan: false, rowSpan: false },
  { id: 3, label: 'Kamar Tidur',  color: '#2ec218', bg: 'var(--tlight)', colSpan: false, rowSpan: false },
  { id: 4, label: 'Tampak Depan', color: '#17c055', bg: '#edfff5',       colSpan: false, rowSpan: true  },
  { id: 5, label: 'Taman',        color: '#16bba7', bg: '#f0fff8',       colSpan: false, rowSpan: false },
  { id: 6, label: 'Dapur',        color: '#2ec218', bg: '#f3fff9',       colSpan: false, rowSpan: false },
]

export default function GallerySection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <span className="sec-label">Galeri Properti</span>
      <h2 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>
        Melihat Lebih <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Dekat</em>
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '200px 200px',
        gap: 8,
        marginTop: '2.5rem',
        borderRadius: 24,
        overflow: 'hidden',
      }}>
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: item.bg,
              gridColumn: item.colSpan ? 'span 2' : undefined,
              gridRow: item.rowSpan ? 'span 2' : undefined,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 200 180" fill="none" width={item.colSpan ? '35%' : '55%'} aria-hidden>
              <rect x="30" y="60" width="140" height="110" stroke={item.color} strokeWidth="1.2" />
              <path d="M20 60L100 12L180 60" stroke={item.color} strokeWidth="1.2" />
              <rect x="75" y="108" width="50" height="62" stroke={item.color} strokeWidth="1" />
              <rect x="40" y="82" width="30" height="25" stroke={item.color} strokeWidth="0.8" />
              <rect x="130" y="82" width="30" height="25" stroke={item.color} strokeWidth="0.8" />
            </svg>

            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: hovered === item.id ? 'rgba(29,226,100,0.18)' : 'rgba(29,226,100,0)',
              transition: 'background 0.3s',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1rem',
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--p3)',
                opacity: hovered === item.id ? 1 : 0,
                transition: 'opacity 0.3s',
              }}>
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
