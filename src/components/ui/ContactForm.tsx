'use client'

import { useState } from 'react'
import Loading from '@/components/ui/loading'

export default function ContactForm({ tipeNama }: { tipeNama: string }) {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    pesan: ``
  })

  const [isSending, setIsSending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSend = () => {
    if (!formData.nama || !formData.whatsapp) {
      alert('Mohon isi Nama dan Nomor WhatsApp Anda.')
      return
    }

    setIsSending(true)
    const defaultText = `Halo Rika Negari, saya tertarik dengan ${tipeNama}.`

    const text = `Halo Rika Negari,${formData.pesan ? `\n\n${formData.pesan}` : defaultText}`

    const phone = '081217813965' 

    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
      setIsSending(false)
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <input
        name="nama"
        type="text"
        placeholder="Nama lengkap Anda"
        value={formData.nama}
        onChange={handleChange}
        style={inputSx}
      />
      <input
        name="whatsapp"
        type="tel"
        placeholder="Nomor WhatsApp (cth: 0812...)"
        value={formData.whatsapp}
        onChange={handleChange}
        style={inputSx}
      />
      <input
        name="email"
        type="email"
        placeholder="Email (opsional)"
        value={formData.email}
        onChange={handleChange}
        style={inputSx}
      />
      <textarea
        name="pesan"
        placeholder="Pesan tambahan..."
        rows={3}
        value={formData.pesan}
        onChange={handleChange}
        style={textareaSx}
      />
      
      <button
        type="button"
        onClick={handleSend}
        disabled={isSending}
        style={{
          ...btnSx,
          background: isSending ? 'var(--gray100)' : 'var(--p)',
          cursor: isSending ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSending ? (
          <div style={{ transform: 'scale(0.4)' }}>
            <Loading />
          </div>
        ) : (
          'Kirim Permintaan'
        )}
      </button>
    </div>
  )
}

// ── Styles (Dipisah agar kode bersih) ────────────────────────
const inputSx: React.CSSProperties = {
  width: '100%',
  background: 'var(--white)',
  border: '1.5px solid var(--gray200)',
  color: 'var(--gray900)',
  padding: '0.7rem 0.9rem',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontSize: '0.82rem',
  borderRadius: 10,
  outline: 'none',
}

const textareaSx: React.CSSProperties = {
  ...inputSx,
  resize: 'none',
}

const btnSx: React.CSSProperties = {
  width: '100%',
  color: 'var(--gray900)',
  padding: '0.85rem',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontSize: '0.85rem',
  fontWeight: 700,
  border: 'none',
  borderRadius: 100,
  marginTop: '0.2rem',
  transition: 'all 0.2s'
}