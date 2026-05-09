'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import PropertyCard from '@/components/ui/PropertyCard'
import { getProperties,getTipes} from '@/data/properties'
export default function PropertiPage() {
  const [search, setSearch] = useState('')
  const [filterPerumahan, setFilterPerumahan] = useState('')
  const [filterLuas, setFilterLuas] = useState('')
  const [allTipes, setAllTipes] = useState<any[]>([])
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
console.log(getProperties);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [tipesData, perumahanData] = await Promise.all([
        getTipes(),
        getProperties(),
      ])
      setAllTipes(tipesData || [])
      setPerumahanList(perumahanData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const filtered = useMemo(() => {
    return allTipes.filter((item) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.perumahan?.name?.toLowerCase().includes(q)

      const matchPerumahan =
        !filterPerumahan || item.perumahan?.name === filterPerumahan

      const matchLuas =
        !filterLuas ||
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
    padding: '0.55rem 1rem',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.82rem',
    borderRadius: 100,
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--gray50)', minHeight: '80vh', padding: '3rem 3rem 5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="sec-label">Katalog Lengkap</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>
            Semua <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Properti</em>
          </h1>
        </div>

        {/* Filter bar */}
        <div style={{
          background: 'var(--white)',
          border: '1.5px solid var(--gray200)',
          borderRadius: 16,
          padding: '1.2rem 1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray700)' }}>Filter:</span>

          <input
            style={{ ...inputStyle, minWidth: 220 }}
            type="text"
            placeholder="Cari nama tipe / perumahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={inputStyle}
            value={filterPerumahan}
            onChange={(e) => setFilterPerumahan(e.target.value)}
          >
            <option value="">Semua Perumahan</option>
            {perumahanList.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={filterLuas}
            onChange={(e) => setFilterLuas(e.target.value)}
          >
            <option value="">Semua Luas</option>
            <option value="small">Di bawah 60 m²</option>
            <option value="medium">60 – 80 m²</option>
            <option value="large">Di atas 80 m²</option>
          </select>

          {/* Reset */}
          {(search || filterPerumahan || filterLuas) && (
            <button
              onClick={() => { setSearch(''); setFilterPerumahan(''); setFilterLuas('') }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gray500)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '0 0.5rem',
              }}
            >
              ✕ Reset
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--gray500)', fontWeight: 500 }}>
            {filtered.length} properti ditemukan
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            background: 'var(--white)',
            borderRadius: 16,
            padding: '4rem',
            textAlign: 'center',
            color: 'var(--gray500)',
            fontSize: '0.9rem',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            Memuat properti...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'var(--white)',
            borderRadius: 16,
            padding: '4rem',
            textAlign: 'center',
            color: 'var(--gray500)',
            fontSize: '0.9rem',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏠</div>
            Tidak ada properti yang sesuai dengan filter Anda.
            <br />
            <button
              onClick={() => { setSearch(''); setFilterPerumahan(''); setFilterLuas('') }}
              style={{
                marginTop: '1rem',
                background: 'var(--p)',
                color: 'var(--gray900)',
                border: 'none',
                borderRadius: 100,
                padding: '0.6rem 1.5rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {filtered.map((item, i) => (
              console.log(item.perumahan),
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
    </>
  )
}
