import { createClient } from '@/utils/connect'

// ── Types ─────────────────────────────────────────────────
export interface GaleriItem {
  url: string
  label: string
  urutan: number
}

export interface Tipe {
  id: string
  slug: string
  name: string
  lb: number
  lt: number
  kt: string
  km: number
  harga: string
  badge: string
  galeri?: GaleriItem[]
}

export interface Perumahan {
  id: string
  slug: string
  name: string
  lokasi: string
  unit_tersisa: number
  tipes?: Tipe[]
}
export async function getTipes(): Promise<any[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('tipe_rumah')
    .select(`
      *,
      perumahan:perumahan_id (
        id,
        name,
        slug,
        lokasi
      ),
      galeri (url, label, urutan)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getTipes error:', error)
    return []
  }
  return data ?? []
}
// ── Fetch ──────────────────────────────────────────────────

// ── Fetch Properties (Ditingkatkan dengan fitur Limit & Random) ──
/**
 * Memanggil data perumahan beserta tipenya.
 * @param options.limitPerumahan - Jumlah maksimal perumahan yang diambil (default: null/semua)
 * @param options.limitTipe - Jumlah maksimal tipe rumah per perumahan (default: null/semua)
 */
export async function getProperties(options?: { limitPerumahan?: number; limitTipe?: number }): Promise<Perumahan[]> {
  const supabase = createClient()

  let query = supabase
    .from('perumahan')
    .select(`
      *,
      tipes:tipe_rumah (
        *,
        galeri (url, label, urutan)
      )
    `)
    .order('name')

  // Batasi jumlah perumahan jika ada parameter limitPerumahan
  if (options?.limitPerumahan) {
    query = query.limit(options.limitPerumahan)
  }

  const { data, error } = await query

  if (error) {
    console.error('getProperties error:', error)
    return []
  }

  let finalData = data ?? []

  // Jika ada parameter limitTipe, acak dan potong jumlah tipenya
  if (options?.limitTipe) {
    finalData = finalData.map((p: any) => ({
      ...p,
      tipes: p.tipes 
        ? p.tipes.sort(() => Math.random() - 0.5).slice(0, options.limitTipe) 
        : []
    }))
  }

  return finalData as Perumahan[]
}


export const testimonials = [
  {
    id: 1,
    text: "Saya sangat puas dengan layanan Prima Properti. Proses pembelian rumah berjalan lancar dan timnya sangat responsif.",
    rating: 5,
    name: "AR",
    initials: "AR",
    unit: "Jakarta Selatan",
  },
  {
    id: 2,
    text: "Properti yang saya beli dari Prima Properti sesuai dengan deskripsi dan kualitasnya sangat baik. Sangat direkomendasikan!",
    rating: 4,
    name: "MS",
    initials: "MS",
    unit: "Bandung",
  },
  {
    id: 3,
    text: "Tim Prima Properti membantu saya menemukan rumah impian saya dengan harga yang kompetitif. Pelayanan yang ramah dan profesional.",
    rating: 5,
    name: "LN",
    initials: "LN",
    unit: "Surabaya",
  },
];