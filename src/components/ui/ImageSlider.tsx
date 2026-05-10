'use client'

import { useState } from 'react'
import Image from 'next/image'


interface SlideItem {
  url: string
  label: string
  urutan: number
  name: string
}


interface Props {
  slides: SlideItem[]
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function cldSlider(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_700,c_fill,f_auto,q_85/${publicId}`
}

function cldThumb(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_300,h_200,c_fill,f_auto,q_70/${publicId}`
}

const bgColors = ['var(--plight)', 'var(--slight)', 'var(--tlight)', '#edfff5', '#f4fffe']

export default function ImageSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1))
  return (
    <div>
      {/* Main slider */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden', background: 'var(--gray100)' }}>
        <div style={{
          display: 'flex', height: '100%',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.5s cubic-bezier(0.77,0,0.175,1)',
        }}>
          {slides.map((slide, i) => (
            <div key={i} style={{
              flexShrink: 0, width: '100%', height: '100%',
              background: bgColors[i % bgColors.length],
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {slide.url ? (
                <Image
                  src={cldSlider(slide.url)}
                  alt={slide.label}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ opacity: 0.3, textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>🏠</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrows */}
        {current > 0 && (
          <button onClick={prev} style={arrowStyle('left')}>‹</button>
        )}
        {current < slides.length - 1 && (
          <button onClick={next} style={arrowStyle('right')}>›</button>
        )}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '1.2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: i === current ? 4 : '50%',
              background: i === current ? 'var(--p2)' : 'rgba(29,226,100,0.35)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
            }} />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 3, height: 86, background: 'var(--gray100)' }}>
        {slides.map((slide, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            flex: 1, border: 'none', cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
            background: bgColors[i % bgColors.length],
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            {slide.url && (
              <Image
                src={cldThumb(slide.url)}
                alt={slide.label}
                fill
                sizes="120px"
                style={{ objectFit: 'cover', opacity: i === current ? 1 : 0.55, transition: 'opacity 0.2s' }}
              />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === current ? 'rgba(29,226,100,0.15)' : 'transparent',
              fontSize: '0.68rem', fontWeight: 700,
              color: i === current ? 'var(--p2)' : 'var(--gray500)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
            </div>
            {i === current && (
              <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'var(--p)', borderRadius: '3px 3px 0 0' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', [side]: '1.5rem',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.9)',
    border: '1.5px solid var(--gray200)',
    color: 'var(--gray700)', width: 44, height: 44,
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10, fontSize: '1.2rem',
  }
}