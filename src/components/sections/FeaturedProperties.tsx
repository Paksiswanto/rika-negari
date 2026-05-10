import Link from 'next/link'
import PropertyCard from '@/components/ui/PropertyCard'
import { getProperties } from '@/data/properties'
import type { Perumahan } from '@/data/properties'

export default async function FeaturedProperties() {
  const properties = await getProperties({ limitPerumahan: 5, limitTipe: 3, lokasi: 'Sidoarjo' })

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      {/* Header - Menggunakan flex-wrap agar button turun di layar sangat kecil */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <span className="sec-label">Tersedia Sekarang</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginTop: '0.5rem' }}>
            Perumahan <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Unggulan</em>
          </h2>
        </div>
        <Link href="/properti" className="btn-ghost-green">
          Lihat Semua Properti →
        </Link>
      </div>

      {/* Perumahan blocks */}
      {properties.map((perumahan) => {
        const tipes = perumahan.tipes ?? []

        return (
          <div key={perumahan.id} style={{ marginBottom: '4rem' }}>
            {/* Perumahan header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: 'var(--gray900)',
              }}>
                {perumahan.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray500)', fontWeight: 500, marginTop: 2 }}>
                {perumahan.lokasi}
              </div>
            </div>

            {/* Cards Grid */}
            {tipes.length > 0 ? (
              <div 
                className="grid-responsive" 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                }}
              >
                {tipes.map((tipe, i) => (
                  <div key={tipe.id} className={i > 0 ? 'hide-on-mobile' : ''}>
                    <PropertyCard
                      tipe={tipe}
                      perumahan={perumahan}
                      colorIndex={i}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--gray500)', fontSize: '0.9rem', padding: '1rem', background: 'var(--gray50)', borderRadius: '12px' }}>
                Belum ada tipe properti untuk perumahan ini.
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}