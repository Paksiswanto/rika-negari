import Link from 'next/link'
import PropertyCard from '@/components/ui/PropertyCard'
import { getProperties } from '@/data/properties'
import type { Perumahan } from '@/data/properties'
import { GetTipes } from '@/lib/api'

export default async function FeaturedProperties() {
const properties = await getProperties({ limitPerumahan: 5, limitTipe: 3 , lokasi: 'Sidoarjo' })
  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span className="sec-label">Tersedia Sekarang</span>
          <h2 style={{ fontSize: '2.5rem' }}>
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <div>
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

            </div>

            {/* Cards */}
            {tipes.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
              }}>
                {tipes.map((tipe, i) => (
                  <PropertyCard
                    key={tipe.id}
                    tipe={tipe}
                    perumahan={perumahan}
                    colorIndex={i}
                  />
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--gray500)', fontSize: '0.9rem' }}>
                Belum ada tipe properti untuk perumahan ini.
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
