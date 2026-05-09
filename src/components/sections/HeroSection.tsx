import Link from 'next/link'

export default function HeroSection() {
  return (
    <section style={{
      background: 'var(--plight)',
      padding: '5rem 3rem 0',
      minHeight: '88vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -100, right: -60,
        width: 460, height: 460,
        background: '#d4fce7', borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: '15%',
        width: 320, height: 320,
        background: 'var(--slight)', borderRadius: '50%',
        opacity: 0.55, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '52%', paddingBottom: '4rem' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--white)', border: '1.5px solid #b6f5d4',
          color: 'var(--p3)', padding: '0.35rem 1rem', borderRadius: 100,
          fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.5rem',
        }}>
          <span style={{ width: 7, height: 7, background: 'var(--p)', borderRadius: '50%', display: 'inline-block' }} />
          Properti Terpercaya #1 Jawa Timur
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '3.8rem', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.2rem', color: 'var(--gray900)' }}>
          Temukan Rumah<br />
          <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Impian</em> Keluarga<br />
          Anda Sekarang
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '1rem', color: 'var(--gray500)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '40ch' }}>
          Hunian premium dengan desain modern, lokasi strategis, dan harga yang transparan.
          Wujudkan rumah idaman bersama Prima Properti.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link href="/properti" className="btn-primary">
            Jelajahi Properti →
          </Link>
          <Link href="/#tentang" className="btn-outline">
            Pelajari Lebih Lanjut
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {[
            { num: '12+', label: 'Perumahan' },
            { num: '850+', label: 'Unit Terjual' },
            { num: '15 Th', label: 'Pengalaman' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '2rem', fontWeight: 600,
                  color: 'var(--p2)', lineHeight: 1,
                }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray500)', marginTop: '0.2rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
              {i < 2 && (
                <div style={{ width: 1, height: 40, background: 'var(--gray200)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* House illustrations grid */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '46%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 4,
      }}>
        <div style={{ gridRow: '1/3', background: 'var(--plight)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 280 480" fill="none" width="68%" aria-hidden>
            <rect x="40" y="200" width="200" height="260" stroke="#17c055" strokeWidth="1.5" />
            <path d="M30 200L140 80L250 200" stroke="#17c055" strokeWidth="1.5" />
            <rect x="100" y="310" width="50" height="80" stroke="#17c055" strokeWidth="1.2" />
            <rect x="60" y="250" width="60" height="45" stroke="#17c055" strokeWidth="1" />
            <rect x="165" y="250" width="60" height="45" stroke="#17c055" strokeWidth="1" />
            <line x1="40" y1="460" x2="240" y2="460" stroke="#17c055" strokeWidth="0.8" />
          </svg>
        </div>
        <div style={{ background: 'var(--slight)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 240 220" fill="none" width="65%" aria-hidden>
            <rect x="30" y="90" width="80" height="120" stroke="#16bba7" strokeWidth="1.2" />
            <rect x="130" y="110" width="80" height="100" stroke="#16bba7" strokeWidth="1.2" />
            <path d="M22 90L70 50L118 90" stroke="#16bba7" strokeWidth="1.2" />
            <path d="M122 110L170 75L218 110" stroke="#16bba7" strokeWidth="1.2" />
            <rect x="55" y="145" width="22" height="35" stroke="#16bba7" strokeWidth="0.8" />
          </svg>
        </div>
        <div style={{ background: 'var(--tlight)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 240 220" fill="none" width="65%" aria-hidden>
            <rect x="50" y="80" width="140" height="130" stroke="#2ec218" strokeWidth="1.2" />
            <path d="M40 80L120 30L200 80" stroke="#2ec218" strokeWidth="1.2" />
            <rect x="85" y="145" width="50" height="65" stroke="#2ec218" strokeWidth="1" />
            <rect x="65" y="105" width="40" height="30" stroke="#2ec218" strokeWidth="0.8" />
            <rect x="135" y="105" width="40" height="30" stroke="#2ec218" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    </section>
  )
}
