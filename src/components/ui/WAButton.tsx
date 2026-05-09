'use client'

import { useState } from 'react'

const WA_NUMBER = '081217813965'
const WA_MESSAGE = 'Halo Rika Negari, saya ingin menanyakan informasi properti.'

export default function WAButton() {
  const [hovered, setHovered] = useState(false)

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <div style={{
        background: 'var(--white)',
        color: 'var(--gray700)',
        fontSize: '0.8rem',
        fontWeight: 600,
        padding: '0.5rem 1rem',
        borderRadius: 100,
        whiteSpace: 'nowrap',
        border: '1.5px solid var(--gray200)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(8px)',
        transition: 'all 0.25s',
        pointerEvents: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        Chat via WhatsApp
      </div>

      {/* Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: 56,
          height: 56,
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          position: 'relative',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
        }}
      >
        {/* Notification dot */}
        <div style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 16,
          height: 16,
          background: 'var(--p)',
          borderRadius: '50%',
          border: '2px solid var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          color: 'var(--gray900)',
          fontWeight: 700,
        }}>
          1
        </div>

        {/* WA Icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 3C8.82 3 3 8.82 3 16c0 2.34.64 4.54 1.76 6.42L3 29l6.76-1.74A13 13 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm-3.1 7.3c.28 0 .58.02.82.58.3.68 1 2.52 1.08 2.7.1.18.14.4.02.62-.1.22-.18.36-.36.56-.18.2-.38.44-.54.6-.18.18-.38.38-.16.76.22.38.98 1.62 2.1 2.62 1.44 1.28 2.66 1.68 3.04 1.86.38.18.6.16.82-.1.22-.26.94-1.1 1.18-1.48.24-.38.5-.32.84-.2.34.12 2.16 1.02 2.54 1.2.38.18.62.28.72.44.1.16.1.9-.2 1.76-.3.86-1.76 1.66-2.4 1.72-.64.06-1.24.28-4.18-.88-3.52-1.36-5.74-4.94-5.92-5.16-.18-.22-1.48-1.96-1.48-3.74 0-1.78.94-2.66 1.26-3.02.32-.36.7-.44.94-.44z"
            fill="white"
          />
        </svg>
      </a>
    </div>
  )
}
