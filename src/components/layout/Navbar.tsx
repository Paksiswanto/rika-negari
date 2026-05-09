'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',         label: 'Beranda' },
  { href: '/properti', label: 'Perumahan' },
  { href: '/#tentang', label: 'Tentang Kami' },
  { href: '/#kontak',  label: 'Kontak' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 66, padding: '0 3rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--white)',
      borderBottom: '1.5px solid var(--gray200)',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, color: 'var(--gray900)' }}>
          Prima<span style={{ color: 'var(--p2)' }}>Properti</span>
        </span>
      </Link>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} style={{
              color: pathname === link.href ? 'var(--p2)' : 'var(--gray700)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/#kontak" className="btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.82rem' }}>
        Konsultasi Gratis
      </Link>
    </nav>
  )
}
