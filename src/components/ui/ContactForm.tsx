'use client'

export default function ContactForm({ tipeNama }: { tipeNama: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {[
        { type: 'text',  placeholder: 'Nama lengkap Anda' },
        { type: 'tel',   placeholder: 'Nomor WhatsApp' },
        { type: 'email', placeholder: 'Email (opsional)' },
      ].map((inp) => (
        <input
          key={inp.placeholder}
          type={inp.type}
          placeholder={inp.placeholder}
          style={{
            width: '100%',
            background: 'var(--white)',
            border: '1.5px solid var(--gray200)',
            color: 'var(--gray900)',
            padding: '0.7rem 0.9rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.82rem',
            borderRadius: 10,
            outline: 'none',
          }}
        />
      ))}
      <textarea
        placeholder={`Saya tertarik dengan ${tipeNama}...`}
        rows={3}
        style={{
          width: '100%',
          background: 'var(--white)',
          border: '1.5px solid var(--gray200)',
          color: 'var(--gray900)',
          padding: '0.7rem 0.9rem',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.82rem',
          borderRadius: 10,
          outline: 'none',
          resize: 'none',
        }}
      />
      <button
        type="button"
        style={{
          width: '100%',
          background: 'var(--p)',
          color: 'var(--gray900)',
          padding: '0.85rem',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 700,
          border: 'none',
          borderRadius: 100,
          cursor: 'pointer',
          marginTop: '0.2rem',
        }}
      >
        Kirim Permintaan
      </button>
    </div>
  )
}
