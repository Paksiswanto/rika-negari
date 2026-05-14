import Image from 'next/image'

const pillars = [
  { title: 'Konsultasi Gratis', desc: 'Analisis kebutuhan hunian dan simulasi KPR yang tepat tanpa biaya tambahan.' },
  { title: 'Pilihan Terbaik', desc: 'Rekomendasi unit dari berbagai developer unggulan yang sudah terverifikasi legalitasnya.' },
  { title: 'Pendampingan KPR', desc: 'Kami bantu proses pengajuan KPR ke berbagai Bank partner hingga disetujui (ACC).' },
  { title: 'Transparansi Harga', desc: 'Harga resmi developer tanpa markup, serta informasi biaya pajak dan notaris yang jelas.' },
]

export default function AboutSection() {
  return (
    <section id="tentang" className="section" style={{ background: 'var(--plight)', overflow: 'hidden' }}>
      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* Visual Section */}
        <div style={{ position: 'relative', height: '450px' }}>
          {/* Gambar Utama (Besar) */}
          <div style={{
            position: 'absolute', right: 0, top: 0,
            width: '85%', height: '85%',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}>
            <Image
              src="/images/rika-property.jpeg" // Ganti dengan nama file aslimu
              alt="Rika Property"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Gambar Aksen (Kecil) */}
          <div style={{
            position: 'absolute', left: 0, bottom: 0,
            width: '50%', height: '50%',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '4px solid var(--white)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 2,
          }}>
            <Image
              src="/images/id-card.jpeg" // Path yang benar
              alt="id card"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Text Section */}
        <div>
          <span className="sec-label">Tentang Kami</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginTop: '0.5rem', lineHeight: 1.2 }}>
            Membangun <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Kepercayaan</em> Anda
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--gray500)', lineHeight: 1.8, marginTop: '1.2rem' }}>
            Rika Negari hadir sebagai mitra terpercaya dalam mewujudkan hunian impian anda di Sidoarjo & Surabaya.
            Kami bekerja sama dengan developer pilihan untuk memastikan aset masa depan Anda aman dan menguntungkan.
          </p>

          {/* Pillars Grid */}
          <div className="grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '2rem',
          }}>
            {pillars.map((p) => (
              <div key={p.title} style={{
                background: 'var(--white)',
                borderRadius: '14px',
                padding: '1.2rem',
                border: '1.5px solid #b6f5d4',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray900)', marginBottom: '0.4rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray500)', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}