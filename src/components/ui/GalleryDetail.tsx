'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function GalleryDetail({ images }: { images: any[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const getUrl = (id: string) => `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${id}`

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedImg(getUrl(img.url))}
            style={{ 
              borderRadius: 16, 
              overflow: 'hidden', 
              cursor: 'zoom-in',
              position: 'relative',
              aspectRatio: '4/3',
              backgroundColor: 'var(--gray100)'
            }}
          >
            <Image 
              src={getUrl(img.url)} 
              alt={img.label || 'Galeri'} 
              fill 
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Modal Lightbox */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
          }}
        >
          <button style={{ position: 'absolute', top: 20, right: 20, color: 'white', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src={selectedImg} alt="Preview" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}