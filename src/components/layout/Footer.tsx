"use client"

import Link from 'next/link'
import { FaInstagramSquare , FaWhatsappSquare , FaFacebook , FaTiktok , } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--gray900)', padding: '5rem 1.5rem 2rem' }}>
      <div 
        className="grid-responsive" // Menggunakan class dari globals.css yang kita buat
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '4rem',
          maxWidth: '1200px',
          margin: '0 auto 4rem auto'
        }}
      >
        {/* Brand */}
        <div style={{ minWidth: '200px' }}>
          <div style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.6rem',
            fontWeight: 600,
            color: 'var(--white)',
            marginBottom: '0.8rem',
          }}>
            Rika<span style={{ color: 'var(--p)' }}>Negari</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64927a', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '300px' }}>
            Mewujudkan hunian impian dengan kualitas premium dan standar terpercaya di Sidoarjo & Surabaya.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[
              { href: 'https://www.instagram.com/rikanegari/', icon: <FaInstagramSquare size={18} /> },
              { href: 'https://www.facebook.com/share/1aTjifyBow/', icon: <FaFacebook size={18} /> },
              { href: 'https://www.tiktok.com/@rikanegari', icon: <FaTiktok size={18} /> },
              { href: 'https://wa.me/6281217813965', icon: <FaWhatsappSquare size={18} /> },
            ].map((s) => (
              <Link key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64927a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: '0.3s'
                  }}
                >
                  {s.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Perumahan */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2a5c3e', marginBottom: '1.2rem' }}>
            Perumahan
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Grand Sentosa Land', 'Green Mansion Juanda', 'The Oso', 'Semua Perumahan'].map((item) => (
              <li key={item}>
                <Link href="/properti" style={{ fontSize: '0.83rem', color: '#64927a', textDecoration: 'none' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Perusahaan */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2a5c3e', marginBottom: '1.2rem' }}>
            Perusahaan
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Tentang Kami', 'Tim & Agen', 'Karir', 'Blog & Berita'].map((item) => (
              <li key={item}>
                <Link href="/#tentang" style={{ fontSize: '0.83rem', color: '#64927a', textDecoration: 'none' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2a5c3e', marginBottom: '1.2rem' }}>
            Kontak
          </div>
          {[
            { label: 'Kantor Pusat', value: 'Sidoarjo, Jawa Timur' },
            { label: 'Telepon', value: '081217813965' },
            { label: 'Email', value: 'info@rikanegari.co.id' },
          ].map((c) => (
            <div key={c.label} style={{ fontSize: '0.83rem', color: '#64927a', marginBottom: '0.85rem', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--white)', fontWeight: 500 }}>{c.label}</strong>
              <br />
              {c.value}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#2a5c3e' }}>
          © 2026 Rika Negari. Seluruh hak cipta dilindungi.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Kebijakan Privasi', 'Syarat & Ketentuan'].map((item) => (
            <Link key={item} href="/" style={{ fontSize: '0.75rem', color: '#2a5c3e', textDecoration: 'none' }}>
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}