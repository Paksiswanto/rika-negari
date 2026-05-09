import Link from 'next/link'
import { FiInstagram, FiPhoneCall, FiFacebook, FiMail } from "react-icons/fi";
import { getProperties } from '@/data/properties';

const properties = await getProperties({ limitPerumahan: 5, limitTipe: 3 , lokasi: 'Sidoarjo' })


export default function Footer() {
  return (
    <footer style={{ background: 'var(--gray900)', padding: '5rem 3rem 2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: '4rem',
        marginBottom: '4rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.6rem',
            fontWeight: 600,
            color: 'var(--white)',
            marginBottom: '0.8rem',
          }}>
            Rika<span style={{ color: 'var(--p)' }}>Negari</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64927a', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Mewujudkan hunian impian dengan kualitas premium dan standar terpercaya.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[
              { href: 'https://www.instagram.com/rikanegari/', icon: <FiInstagram size={30} /> },
              { href: 'https://www.facebook.com/rikanegari', icon: <FiFacebook size={30} /> },
              { href: 'mailto:info@rikanegari.co.id/', icon: <FiMail size={30} /> },
              { href: 'https://wa.me/628128128128?text=Halo%20Rika%20Negari,%20saya%20ingin%20menanyakan%20informasi%20properti.', icon: <FiPhoneCall size={30} /> },
            ].map((s) => (
              <Link key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64927a',
                    border: '1px solid rgba(255,255,255,0.08)',
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
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {properties.map((item) => (
              <li key={item.id}>
                <Link href={`/properti/${item.slug}`} style={{ fontSize: '0.83rem', color: '#64927a', textDecoration: 'none' }}>
                  {item.name}
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
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
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
            <div key={c.label} style={{ fontSize: '0.83rem', color: '#64927a', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--white)', fontWeight: 500 }}>{c.label}</strong>
              <br />
              {c.value}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#2a5c3e' }}>
          © 2026 Rika Negari. Seluruh hak cipta dilindungi.
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
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