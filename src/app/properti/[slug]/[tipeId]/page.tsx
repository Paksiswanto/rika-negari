import { notFound } from 'next/navigation'
import { createClient } from '@/utils/connect'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAButton from '@/components/ui/WAButton'
import ImageSlider from '@/components/ui/ImageSlider'
import ContactForm from '@/components/ui/ContactForm'
import GalleryDetail from '@/components/ui/GalleryDetail'

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
       <div style={{ padding: '1rem 3rem', display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--gray500)', borderBottom: '1px solid var(--gray200)', flexWrap: 'wrap' }}>

          <a href="/" style={{ color: 'var(--gray500)', textDecoration: 'none' }}>Beranda</a>

          <span>›</span>

          <a href="/properti" style={{ color: 'var(--gray500)', textDecoration: 'none' }}>Properti</a>

          <span>›</span>

          <span style={{ color: 'var(--p3)', fontWeight: 600 }}>{tipe.name}</span>

        </div>

        {/* Layout Grid Baru */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 400px', // Kiri lebar, kanan fixed
          gap: '2rem', 
          padding: '2rem 3rem',
          maxWidth: '1400px',
          margin: '0 auto',
          alignItems: 'start' // WAJIB agar sticky jalan
        }}>
          
          {/* KOLOM KIRI: Galeri memanjang ke bawah */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <GalleryDetail images={galeri} />
             
             {/* Deskripsi pindah ke bawah galeri agar tidak kosong saat scroll */}
             <div style={{ padding: '1rem 0' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Tentang {perumahan.name}</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--gray600)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{perumahan.deskripsi}</p>
                {tipe.deskripsi && (
                   <p style={{ fontSize: '0.95rem', color: 'var(--gray600)', lineHeight: 1.8 }}>{tipe.deskripsi}</p>
                )}
             </div>
          </div>

          {/* KOLOM KANAN: Card Sticky */}
          <div style={{ 
            position: 'sticky', 
            top: '100px', // Jarak dari atas saat scroll
            padding: '2rem',
            borderRadius: 24,
            border: '1.5px solid var(--gray200)',
            backgroundColor: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{tipe.name}</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray500)', marginBottom: '1.5rem' }}>📍 {perumahan.lokasi}</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 600, color: 'var(--p2)' }}>{tipe.harga}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray500)', fontWeight: 700, textTransform: 'uppercase' }}>Harga Mulai</div>
            </div>

            <div className="divider" style={{ margin: '1.5rem 0', height: '1px', background: 'var(--gray200)' }} />

            {/* Specs Mini */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '2rem' }}>
              {specs.map((s) => (
                <div key={s.key} style={{ background: 'var(--gray50)', borderRadius: 12, padding: '0.8rem', border: '1px solid var(--gray100)' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--p3)' }}>{s.val}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--gray500)', textTransform: 'uppercase' }}>{s.key}</div>
                </div>
              ))}
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