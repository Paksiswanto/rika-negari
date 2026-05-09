const pillars = [
  { title: 'Konsultasi Gratis', desc: 'Analisis kebutuhan hunian dan simulasi KPR yang tepat tanpa biaya tambahan.' },
  { title: 'Pilihan Terbaik', desc: 'Rekomendasi unit dari berbagai developer unggulan yang sudah terverifikasi legalitasnya.' },
  { title: 'Pendampingan KPR', desc: 'Kami bantu proses pengajuan KPR ke berbagai Bank partner hingga disetujui (ACC).' },
  { title: 'Transparansi Harga', desc: 'Harga resmi developer tanpa markup, serta informasi biaya pajak dan notaris yang jelas.' },
]

export default function AboutSection() {
  return (
    <section id="tentang" className="section" style={{ background: 'var(--plight)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5rem',
        alignItems: 'center',
      }}>
        {/* Visual */}
        <div style={{ position: 'relative', height: 420 }}>
          {/* Main card */}
          <div style={{
            position: 'absolute', right: 0, top: 0,
            width: '78%', height: '82%',
            background: '#c8fce0',
            borderRadius: 24,
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
            borderRadius: 20,
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
            borderRadius: 20,
            padding: '1.5rem 2rem',
            textAlign: 'center',
            zIndex: 10,
            border: '2px solid #b6f5d4',
            boxShadow: '0 4px 20px rgba(29,226,100,0.15)',
          }}>
            <div style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '3rem', fontWeight: 600,
              color: 'var(--p2)', lineHeight: 1,
            }}>
              15
            </div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--gray500)', marginTop: '0.3rem',
            }}>
              Tahun Pengalaman
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <span className="sec-label">Tentang Kami</span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>
            Membangun <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Kepercayaan</em>
            <br />Anda
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--gray500)', lineHeight: 1.8, marginTop: '1.2rem' }}>
            Rika Negari hadir sebagai mitra terpercaya dalam mewujudkan hunian impian anda. Dengan koleksi puluhan unit yang telah
            diserahterimakan, kami berkomitmen menghadirkan properti berkualitas dengan harga transparan.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray500)', lineHeight: 1.8, marginTop: '0.8rem' }}>
            Setiap unit melewati standar kualitas ketat dan didukung garansi struktur penuh untuk
            ketenangan pikiran Anda.
          </p>

          {/* Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1.5rem',
          }}>
            {pillars.map((p) => (
              <div key={p.title} style={{
                background: 'var(--white)',
                borderRadius: 14,
                padding: '1rem 1.1rem',
                border: '1.5px solid #b6f5d4',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray900)', marginBottom: '0.3rem' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.77rem', color: 'var(--gray500)', lineHeight: 1.6 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
