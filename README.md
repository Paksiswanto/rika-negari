# Prima Properti — Next.js Web

Website properti premium dengan tema hijau, dibangun menggunakan Next.js 14 App Router + TypeScript.

---

## Struktur Folder

```
src/
├── app/
│   ├── globals.css          # CSS variables & global styles
│   ├── layout.tsx           # Root layout + metadata
│   ├── page.tsx             # Landing page (/)
│   └── properti/
│       ├── page.tsx         # Semua properti + filter (/properti)
│       └── [slug]/
│           └── [tipeId]/
│               └── page.tsx # Detail unit (/properti/[slug]/[tipeId])
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AnnouncementStrip.tsx
│   │   ├── FeaturedProperties.tsx
│   │   ├── AboutSection.tsx
│   │   ├── GallerySection.tsx
│   │   └── TestimonialsSection.tsx
│   └── ui/
│       ├── PropertyCard.tsx
│       ├── ImageSlider.tsx
│       └── WAButton.tsx
└── data/
    └── properties.ts        # Data perumahan, tipe, testimoni
```

---

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka browser
# http://localhost:3000
```

---

## Routing

| URL | Halaman |
|-----|---------|
| `/` | Landing page (hero, properti unggulan, about, galeri, testimoni) |
| `/properti` | Semua properti dengan filter nama / perumahan / luas |
| `/properti/grand-mutiara-residence/monaco-80` | Detail tipe Monaco 80 |
| `/properti/puri-harmoni-surabaya/orchid-70` | Detail tipe Orchid 70 |

---

## Warna Brand

| Variable | Hex | Fungsi |
|----------|-----|--------|
| `--p`  | `#1de264` | Primary — tombol, badge, strip |
| `--s`  | `#1de2c7` | Secondary — card accent, slider |
| `--t`  | `#38e21d` | Tertiary — variasi card ke-3 |

---

## Menambah Data Properti

Edit file `src/data/properties.ts` — tambah objek baru di array `perumahanList`:

```ts
{
  id: 'nama-perumahan',
  name: 'Nama Perumahan',
  slug: 'nama-perumahan',       // dipakai untuk URL
  lokasi: 'Kota, Provinsi',
  kota: 'Kota',
  unitTersisa: 10,
  deskripsi: '...',
  tipes: [
    {
      id: 'tipe-45',            // dipakai untuk URL
      name: 'Tipe 45',
      lb: 45, lt: 72,
      kt: '2+1', km: 2,
      harga: 'Rp 600 Juta',
      hargaNum: 600000000,
      badge: 'Ready Stock',
      highlight: true,
      fasilitas: ['Kolam renang', '...'],
      deskripsi: '...',
    }
  ]
}
```

---

## Tombol WhatsApp

Edit nomor WA di `src/components/ui/WAButton.tsx`:

```ts
const WA_NUMBER = '6281234567890'   // format: 62 + nomor
const WA_MESSAGE = 'Halo Prima Properti...'
```
