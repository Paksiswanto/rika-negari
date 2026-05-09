import { testimonials } from '@/data/properties'

const avatarColors = [
  { bg: 'var(--plight)', color: 'var(--p2)' },
  { bg: 'var(--slight)', color: 'var(--s2)' },
  { bg: 'var(--tlight)', color: 'var(--t2)' },
]

export default function TestimonialsSection() {
  return (
    <section className="section" style={{ background: 'var(--plight)' }}>
      <span className="sec-label">Apa Kata Mereka</span>
      <h2 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>
        Kepuasan <em style={{ fontStyle: 'italic', color: 'var(--p2)' }}>Pelanggan</em> Kami
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginTop: '2.5rem',
      }}>
        {testimonials.map((t, i) => (
          <div key={t.id} style={{
            background: 'var(--white)',
            borderRadius: 20,
            padding: '2rem',
            border: '1.5px solid #b6f5d4',
          }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
              {Array.from({ length: t.rating }).map((_, si) => (
                <span key={si} style={{ fontSize: '0.85rem', color: 'var(--p2)' }}>★</span>
              ))}
            </div>

            {/* Text */}
            <p style={{
              fontSize: '0.87rem',
              color: 'var(--gray500)',
              lineHeight: 1.8,
              marginBottom: '1.5rem',
              fontStyle: 'italic',
            }}>
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: avatarColors[i % 3].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem',
                color: avatarColors[i % 3].color,
                flexShrink: 0,
              }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontSize: '0.87rem', fontWeight: 700, color: 'var(--gray900)' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray500)' }}>
                  {t.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
