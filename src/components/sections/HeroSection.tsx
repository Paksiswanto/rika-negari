import Link from 'next/link'

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '92vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--gray900)', // Warna dasar saat gambar loading
    }}>
      {/* Background Image Container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070")', // Ganti dengan URL gambar proyekmu
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1
      }} />

      {/* Backdrop Blur & Dark Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(13, 31, 23, 0.85), rgba(13, 31, 23, 0.6), rgba(13, 31, 23, 0.9))',
        backdropFilter: 'blur(3px)',
        zIndex: 2
      }} />

      {/* Content */}
      <div className="section" style={{ 
        position: 'relative', 
        zIndex: 3, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(29, 226, 100, 0.3)',
          color: 'var(--p)', padding: '0.45rem 1.2rem', borderRadius: 100,
          fontSize: '0.8rem', fontWeight: 700, marginBottom: '2rem',
        }}>
          <span style={{ width: 8, height: 8, background: 'var(--p)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--p)' }} />
          Properti Terpercaya #1 Jawa Timur
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: 600, 
          lineHeight: 1.1, 
          marginBottom: '1.5rem', 
          color: 'var(--white)',
          maxWidth: '900px'
        }}>
          Temukan Rumah <em style={{ fontStyle: 'italic', color: 'var(--p)' }}>Impian</em><br />
          Keluarga Anda Sekarang
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.15rem)', 
          color: 'rgba(255,255,255,0.8)', 
          lineHeight: 1.7, 
          marginBottom: '2.5rem', 
          maxWidth: '60ch' 
        }}>
          Wujudkan hunian premium dengan desain modern dan lokasi strategis bersama Rika Negari. 
          Harga transparan dan proses KPR yang kami dampingi hingga tuntas.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/properti" className="btn-primary" style={{ boxShadow: '0 10px 20px rgba(29, 226, 100, 0.2)' }}>
            Jelajahi Properti →
          </Link>
          <Link href="/#tentang" className="btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            Pelajari Lebih Lanjut
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-responsive" style={{ 
          display: 'flex', 
          gap: 'clamp(1.5rem, 5vw, 4rem)', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1.5rem 3rem',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(5px)'
        }}>
          {[
            { num: '12+', label: 'Perumahan' },
            { num: '850+', label: 'Unit Terjual' },
            { num: '15 Th', label: 'Pengalaman' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '2.2rem', fontWeight: 600,
                color: 'var(--p)', lineHeight: 1,
              }}>
                {stat.num}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}