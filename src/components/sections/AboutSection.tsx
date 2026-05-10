const pillars = [
  { title: 'Konsultasi Gratis', desc: 'Analisis kebutuhan hunian dan simulasi KPR yang tepat tanpa biaya tambahan.' },
  { title: 'Pilihan Terbaik', desc: 'Rekomendasi unit dari berbagai developer unggulan yang sudah terverifikasi legalitasnya.' },
  { title: 'Pendampingan KPR', desc: 'Kami bantu proses pengajuan KPR ke berbagai Bank partner hingga disetujui (ACC).' },
  { title: 'Transparansi Harga', desc: 'Harga resmi developer tanpa markup, serta informasi biaya pajak dan notaris yang jelas.' },
]

export default function AboutSection() {
  return (
    <section id="tentang" className="section" style={{ background: 'var(--plight)', overflow: 'hidden' }}>
      {/* Container Utama - Kita gunakan class grid-responsive dari globals.css yang kita buat tadi */}
      <div className="grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* Visual Section */}
        <div style={{ position: 'relative', height: '420px' }}>
          {/* Main card */}
          <div style={{
            position: 'absolute', right: 0, top: 0,
            width: '78%', height: '82%',
            background: '#c8fce0',
            borderRadius: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 300 260" fill="none" width="60%" aria-hidden>
              <rect x="50" y="110" width="200" height="135" stroke="#17c055" strokeWidth="1.5" />
              <path d="M38 110L150 42L262 110" stroke="#17c055" strokeWidth="1.5" />
              <rect x="105" y="165" width="40" height="55" stroke="#17c055" strokeWidth="1.2" />
              <rect x="158" y="148" width="50" height="40" stroke="#17c055" strokeWidth="1" />
              <rect x="68" y="148" width="42" height="38" stroke="#17c055" strokeWidth="1" />
            </svg>
          </div>

          {/* Accent card */}
          <div style={{
            position: 'absolute', left: 0, bottom: 0,
            width: '46%', height: '52%',
            background: 'var(--slight)',
            borderRadius: '20px',
            border: '2px solid #9dfce8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 200 180" fill="none" width="62%" aria-hidden>
              <rect x="25" y="70" width="150" height="100" stroke="#16bba7" strokeWidth="1.2" />
              <path d="M15 70L100 15L185 70" stroke="#16bba7" strokeWidth="1.2" />
              <rect x="75" y="118" width="50" height="52" stroke="#16bba7" strokeWidth="1" />
            </svg>
          </div>

          {/* Years badge */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--white)',
            borderRadius: '20px',
            padding: '1.2rem 1.8rem',
            textAlign: 'center',
            zIndex: 10,
            border: '2px solid #b6f5d4',
            boxShadow: '0 4px 20px rgba(29,226,100,0.15)',
          }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 600, color: 'var(--p2)', lineHeight: 1 }}>15</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray500)', marginTop: '0.3rem', whiteSpace: 'nowrap' }}>
              Tahun Pengalaman
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div>
          <span className="sec-label">Tentang Kami</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', lineHeight: 1.2 }}>
            Membangun <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Kepercayaan</em> Anda
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--gray500)', lineHeight: 1.8, marginTop: '1.2rem' }}>
            Rika Negari hadir sebagai mitra terpercaya dalam mewujudkan hunian impian anda di Sidoarjo & Surabaya.
            Kami berkomitmen menghadirkan properti berkualitas dengan harga transparan.
          </p>

          {/* Pillars Grid - Menggunakan class grid-responsive untuk HP */}
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