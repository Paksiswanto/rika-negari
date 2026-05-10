'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa' // Pastikan react-icons sudah terinstal

const links = [
  { href: '/',         label: 'Beranda' },
  { href: '/properti', label: 'Perumahan' },
  { href: '/#tentang', label: 'Tentang Kami' },
  { href: '/#kontak',  label: 'Kontak' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 66, padding: '0 1.5rem', // Padding dikecilkan agar aman di HP
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--white)',
      borderBottom: '1.5px solid var(--gray200)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', zIndex: 101 }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, color: 'var(--gray900)' }}>
          Rika<span style={{ color: 'var(--p2)' }}>Negari</span>
        </span>
      </Link>

      {/* Desktop Menu */}
      <ul className="nav-links" style={{ 
        display: 'flex', 
        gap: '2rem', 
        listStyle: 'none', 
        alignItems: 'center' 
      }}>
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
        <li>
          <Link href="/#kontak" className="btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.82rem' }}>
            Konsultasi Gratis
          </Link>
        </li>
      </ul>

      {/* Hamburger Icon - Muncul hanya di layar kecil */}
      <div className="burger-menu" onClick={toggleMenu} style={{
        display: 'none',
        fontSize: '1.5rem',
        color: 'var(--gray900)',
        cursor: 'pointer',
        zIndex: 101
      }}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          background: 'var(--white)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '2rem',
          zIndex: 100,
          animation: 'fadeIn 0.3s ease'
        }}>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)} // Tutup menu setelah klik
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--gray900)',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/#kontak" 
            className="btn-primary" 
            onClick={() => setIsOpen(false)}
            style={{ marginTop: '1rem' }}
          >
            Konsultasi Gratis
          </Link>
        </div>
      )}

      {/* CSS Khusus Responsif */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .burger-menu {
            display: block !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}