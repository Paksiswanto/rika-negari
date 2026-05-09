const items = [
  { label: 'Gratis Biaya KPR', sub: 'untuk pembelian bulan ini' },
  { label: 'SHM Langsung', sub: 'atas nama pembeli' },
  { label: 'Cicilan 0%', sub: 'selama 12 bulan pertama' },
  { label: 'Lokasi Strategis', sub: 'dekat pusat kota & tol' },
  { label: 'Garansi Struktur', sub: '5 tahun developer' },
]

export default function AnnouncementStrip() {
  return (
    <div style={{
      background: 'var(--p)',
      padding: '0.85rem 3rem',
      display: 'flex',
      gap: '3rem',
      alignItems: 'center',
      overflowX: 'auto',
    }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <span style={{
            width: 8, height: 8,
            background: 'var(--gray900)',
            borderRadius: '50%',
            opacity: 0.3,
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--gray900)' }}>
            <strong>{item.label}</strong> {item.sub}
          </span>
        </div>
      ))}
    </div>
  )
}
