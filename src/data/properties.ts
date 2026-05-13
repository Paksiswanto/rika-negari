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
export async function getTipes(options?: { page?: number; limit?: number; search?: string; perumahanId?: string; luas?: string }): Promise<{ data: any[], count: number }> {
  const supabase = createClient()

  const page = options?.page || 1
  const limit = options?.limit || 6
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('tipe_rumah')
    .select(`
      *,
      perumahan:perumahan_id (id, name, slug, lokasi),
      galeri (url, label, urutan)
    `, { count: 'exact' }) // Menghitung total data di database

  // Server-side Filtering
  if (options?.search) query = query.ilike('name', `%${options.search}%`)
  if (options?.perumahanId) query = query.eq('perumahan_id', options.perumahanId)

  if (options?.luas === 'small') query = query.lt('lb', 60)
  if (options?.luas === 'medium') query = query.gte('lb', 60).lte('lb', 80)
  if (options?.luas === 'large') query = query.gt('lb', 80)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('getTipes error:', error)
    return { data: [], count: 0 }
  }
  return { data: data ?? [], count: count ?? 0 }
}
// ── Fetch ──────────────────────────────────────────────────

// ── Fetch Properties (Ditingkatkan dengan fitur Limit & Random) ──
/**
 * Memanggil data perumahan beserta tipenya.
 * @param options.limitPerumahan - Jumlah maksimal perumahan yang diambil (default: null/semua)
 * @param options.limitTipe - Jumlah maksimal tipe rumah per perumahan (default: null/semua)
 * @param options.lokasi - Filter berdasarkan lokasi perumahan
 */
export async function getProperties(options?: { limitPerumahan?: number; limitTipe?: number; lokasi?: string }): Promise<Perumahan[]> {
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

  // Filter berdasarkan lokasi jika ada parameter lokasi
  if (options?.lokasi) {
    query = query.eq('kota', options.lokasi)
  }

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