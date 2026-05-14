import { notFound } from 'next/navigation'
import { createClient } from '@/utils/connect'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import ImageSlider from '@/components/ui/ImageSlider'
import ContactForm from '@/components/ui/ContactForm'
import Link from 'next/link'

interface Props {
  params: { slug: string; tipeId: string }
}

async function getTipe(perumahanSlug: string, tipeSlug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('tipe_rumah')
    .select('*, perumahan!inner(id, name, slug, lokasi, deskripsi), galeri(url, label, urutan)')
    .eq('slug', tipeSlug)
    .eq('perumahan.slug', perumahanSlug)
    .single()
  return data
}

export default async function DetailPage({ params }: Props) {
  const tipe = await getTipe(params.slug, params.tipeId)
  if (!tipe) notFound()

  const perumahan = tipe.perumahan as any
  const galeri = (tipe.galeri ?? []).sort((a: any, b: any) => a.urutan - b.urutan)

  const specs = [
    { val: `${tipe.lb} m²`, key: 'Luas Bangunan' },
    { val: `${tipe.lt} m²`, key: 'Luas Tanah' },
    { val: tipe.kt, key: 'Kamar Tidur' },
    { val: String(tipe.km), key: 'Kamar Mandi' },
  ]

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: 'white' }}>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--gray500)', borderBottom: '1px solid var(--gray200)', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: 'var(--gray500)', textDecoration: 'none' }}>Beranda</a>
          <span>›</span>
          <a href="/properti" style={{ color: 'var(--gray500)', textDecoration: 'none' }}>Properti</a>
          <span>›</span>
          <span style={{ color: 'var(--p3)', fontWeight: 600 }}>{tipe.name}</span>
        </div>


        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>

          <Link
            href="/properti"
            className="btn-back" // Tambahkan class ini
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--gray700)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              backgroundColor: 'var(--gray50)',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke Katalog
          </Link>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Fraunces, serif' }}>{tipe.name}</h1>
            <p style={{ fontSize: '1rem', color: 'var(--gray500)', marginBottom: '1.5rem' }}>📍 {perumahan.lokasi}</p>

            <div style={{ display: '', alignItems: 'baseline', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Harga Mulai : </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 600, color: 'var(--p2)' }}>{tipe.harga}</div>
            </div>
          </div>


          <ImageSlider slides={galeri} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            padding: '1.5rem',
            background: 'var(--gray50)',
            borderRadius: '20px',
            border: '1px solid var(--gray200)'
          }}>
            {specs.map((s) => (
              <div key={s.key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gray900)' }}>{s.val}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray500)', textTransform: 'uppercase', marginTop: '4px' }}>{s.key}</div>
              </div>
            ))}
          </div>

          <div style={{ lineHeight: 1.8 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' }}>Tentang {perumahan.name}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--gray600)', marginBottom: '2rem' }}>{perumahan.deskripsi}</p>

            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' }}>Detail Tipe {tipe.name}</h2>
            {tipe.deskripsi && (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: tipe.deskripsi }}
                style={{ fontSize: '1rem', color: 'var(--gray600)' }}
              />
            )}
          </div>

          <div style={{
            padding: '2.5rem',
            borderRadius: 24,
            border: '2px solid var(--plight)',
            backgroundColor: 'var(--white)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Tertarik dengan unit ini?</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray500)' }}>Isi formulir di bawah, tim marketing kami akan segera menghubungi Anda.</p>
            </div>
            <ContactForm tipeNama={tipe.name} />
          </div>

        </div>
      </main>
      <Footer />
      <WAButton />
    </>
  )
}