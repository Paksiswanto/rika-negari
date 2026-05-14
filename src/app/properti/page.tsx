'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import PropertyCard, { PropertyCardSkeleton } from '@/components/ui/PropertyCard'
import { getProperties, getTipes } from '@/data/properties'

export default function PropertiPage() {
  // ─── Data & Loading States ───
  const [allTipes, setAllTipes] = useState<any[]>([])
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ─── Pagination States ───
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 6

  // ─── Filter States ───
  const [search, setSearch] = useState('')
  const [filterPerumahan, setFilterPerumahan] = useState('')
  const [filterLuas, setFilterLuas] = useState('')

  // 1. Ambil data list perumahan (hanya sekali saat mount)
  useEffect(() => {
    getProperties().then(res => setPerumahanList(res))
  }, [])

  // 2. Fetch Utama: Ambil tipe rumah setiap kali Page atau Filter berubah
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      // Memanggil fungsi getTipes yang sudah kita update di properties.ts
      const res = await getTipes({
        page: currentPage,
        limit: itemsPerPage,
        search,
        perumahanId: filterPerumahan,
        luas: filterLuas
      })

      if (isMounted) {
        setAllTipes(res.data)
        setTotalItems(res.count)
        // Delay sedikit agar animasi shimmer skeleton terlihat halus di layar
        setTimeout(() => setLoading(false), 600)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [currentPage, search, filterPerumahan, filterLuas])

  // 3. Reset halaman ke-1 setiap kali filter berubah
  const handleFilterChange = (type: 'search' | 'per' | 'luas', val: string) => {
    if (type === 'search') setSearch(val)
    if (type === 'per') setFilterPerumahan(val)
    if (type === 'luas') setFilterLuas(val)
    setCurrentPage(1)
  }
  const getPaginationGroup = (currentPage: number, totalPages: number) => {
    const delta = 1; // Jumlah angka di kiri & kanan halaman aktif
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div>
      <Navbar />

      <main className="section" style={{ background: 'var(--gray50)', minHeight: '88vh' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <span className="sec-label">Katalog Lengkap</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', marginTop: '0.5rem', fontWeight: 800 }}>
            Semua <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Properti</em>
          </h1>
        </div>

        <div style={filterBarSx}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Cari tipe rumah..."
            value={search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <select style={inputStyle} value={filterPerumahan} onChange={(e) => handleFilterChange('per', e.target.value)}>
            <option value="">Semua Perumahan</option>
            {perumahanList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select style={inputStyle} value={filterLuas} onChange={(e) => handleFilterChange('luas', e.target.value)}>
            <option value="">Semua Luas</option>
            <option value="small">Kecil ({"<"} 60m²)</option>
            <option value="medium">Sedang (60-80m²)</option>
            <option value="large">Besar ({">"} 80m²)</option>
          </select>

          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--gray500)', fontWeight: 700 }}>
            {loading ? '...' : `${totalItems} UNIT`}
          </div>
        </div>

        <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {loading ? (
            <>{[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}</>
          ) : allTipes.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: 24 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ color: 'var(--gray500)', fontWeight: 500 }}>Properti yang kamu cari tidak ditemukan.</p>
              <button
                onClick={() => { setSearch(''); setFilterPerumahan(''); setFilterLuas(''); setCurrentPage(1) }}
                style={{ marginTop: '1rem', color: 'var(--p2)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Reset semua filter
              </button>
            </div>
          ) : (
            allTipes.map((item, i) => (
              <PropertyCard
                key={item.id}
                tipe={item}
                perumahan={item.perumahan}
                colorIndex={i % 3}
              />
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4.5rem' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0) }}
              style={{ ...btnPageStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              ‹
            </button>
            {getPaginationGroup(currentPage, totalPages).map((item, i) => (
              <button
                key={i}
                disabled={item === '...'}
                onClick={() => { if (item !== '...') { setCurrentPage(Number(item)); window.scrollTo(0, 0); } }}
                style={{
                  ...btnPageStyle,
                  background: currentPage === item ? 'var(--p)' : 'white',
                  borderColor: currentPage === item ? 'var(--p)' : 'var(--gray200)',
                  fontWeight: currentPage === item ? 700 : 500,
                  cursor: item === '...' ? 'default' : 'pointer',
                  border: item === '...' ? 'none' : '1.5px solid var(--gray200)',
                }}
              >
                {item}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0) }}
              style={{ ...btnPageStyle, opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              ›
            </button>
          </div>
        )}
      </main>

      <Footer />
      <WAButton />
    </div>
  )
}

const filterBarSx: React.CSSProperties = {
  background: 'white',
  border: '1.5px solid var(--gray200)',
  borderRadius: 24,
  padding: '1.2rem 1.8rem',
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '3.5rem',
  flexWrap: 'wrap',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
}

const inputStyle: React.CSSProperties = {
  background: 'var(--gray50)',
  border: '1.5px solid var(--gray200)',
  padding: '0.7rem 1.4rem',
  borderRadius: 100,
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'all 0.2s',
  flex: '1 1 220px',
  fontFamily: 'inherit'
}

const btnPageStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  border: '1.5px solid var(--gray200)',
  background: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  fontSize: '0.9rem'
}