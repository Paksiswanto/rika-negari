'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import PropertyCard from '@/components/ui/PropertyCard'
import { getProperties, getTipes } from '@/data/properties'

export default function PropertiPage() {
  const [search, setSearch] = useState('')
  const [filterPerumahan, setFilterPerumahan] = useState('')
  const [filterLuas, setFilterLuas] = useState('')
  const [allTipes, setAllTipes] = useState<any[]>([])
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tipesData, perumahanData] = await Promise.all([
          getTipes(),
          getProperties(),
        ])
        if (isMounted) {
          setAllTipes(tipesData || [])
          setPerumahanList(perumahanData || [])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    return allTipes.filter((item) => {
      const q = search.toLowerCase()
      const matchSearch = !q || item.name?.toLowerCase().includes(q) || item.perumahan?.name?.toLowerCase().includes(q)
      const matchPerumahan = !filterPerumahan || item.perumahan?.name === filterPerumahan
      const matchLuas = !filterLuas || 
        (filterLuas === 'small' && item.lb < 60) || 
        (filterLuas === 'medium' && item.lb >= 60 && item.lb <= 80) || 
        (filterLuas === 'large' && item.lb > 80)
      return matchSearch && matchPerumahan && matchLuas
    })
  }, [allTipes, search, filterPerumahan, filterLuas])

  const inputStyle: React.CSSProperties = {
    background: 'var(--gray50)',
    border: '1.5px solid var(--gray200)',
    color: 'var(--gray700)',
    padding: '0.65rem 1.2rem',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.85rem',
    borderRadius: 100,
    outline: 'none',
    transition: 'all 0.2s',
    flex: '1 1 200px' // Agar input bisa fleksibel lebarnya
  }

  return (
    <div>
      <Navbar />
      {/* Container utama dengan padding responsif */}
      <main className="section" style={{ background: 'var(--gray50)', minHeight: '88vh' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="sec-label">Katalog Lengkap</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', marginTop: '0.5rem' }}>
            Semua <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Properti</em>
          </h1>
        </div>

        {/* Filter bar - Otomatis Wrap di layar kecil */}
        <div style={{
          background: 'var(--white)',
          border: '1.5px solid var(--gray200)',
          borderRadius: 20,
          padding: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray700)', width: '100%', marginBottom: '-0.5rem' }} className="hide-on-desktop">
            Cari & Filter
          </div>

          <input
            style={inputStyle}
            type="text"
            placeholder="Cari tipe / perumahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select style={inputStyle} value={filterPerumahan} onChange={(e) => setFilterPerumahan(e.target.value)}>
            <option value="">Semua Perumahan</option>
            {perumahanList.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select style={inputStyle} value={filterLuas} onChange={(e) => setFilterLuas(e.target.value)}>
            <option value="">Semua Luas</option>
            <option value="small">Di bawah 60 m²</option>
            <option value="medium">60 – 80 m²</option>
            <option value="large">Di atas 80 m²</option>
          </select>

          {(search || filterPerumahan || filterLuas) && (
            <button
              onClick={() => { setSearch(''); setFilterPerumahan(''); setFilterLuas('') }}
              style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
            >
              ✕ Reset
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--gray500)', fontWeight: 600 }}>
            {filtered.length} ditemukan
          </div>
        </div>

        {/* Grid Katalog - Menggunakan grid-responsive dari globals.css */}
        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--gray500)' }}>
            <div className="animate-pulse" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            Memuat data properti...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'var(--white)', borderRadius: 20, padding: '5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: 'var(--gray500)', marginBottom: '1.5rem' }}>Tidak ada properti yang cocok.</p>
            <button onClick={() => { setSearch(''); setFilterPerumahan(''); setFilterLuas('') }} className="btn-primary">Hapus Semua Filter</button>
          </div>
        ) : (
          <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map((item, i) => (
              <PropertyCard
                key={`${item.perumahan_id}-${item.id}`}
                tipe={item}
                perumahan={item.perumahan}
                colorIndex={i % 3}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WAButton />

      <style jsx>{`
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @media (min-width: 769px) {
          .hide-on-desktop { display: none; }
        }
      `}</style>
    </div>
  )
}