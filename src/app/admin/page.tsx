'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/connect'

const supabase = createClient()

// ── Types ────────────────────────────────────────────────────
interface Perumahan {
  id: string
  name: string
  slug: string
  lokasi: string
  unit_tersisa: number
}

interface GaleriItem {
  url: string
  label: string
  urutan: number
}

interface TipeRumah {
  id: string
  perumahan_id: string
  slug: string
  name: string
  lb: number
  lt: number
  kt: string
  km: number
  harga: string
  harga_num: number
  badge: 'Ready Stock' | 'Inden' | 'Best Seller' | 'Premium'
  highlight: boolean
  deskripsi: string
  perumahan?: { name: string }
  galeri?: GaleriItem[]
}

type FormData = {
  perumahan_id: string
  name: string
  slug: string
  deskripsi: string
  badge: string
  lb: string
  lt: string
  kt: string
  km: string
  harga: string
  harga_num: string
  highlight: boolean
}

const EMPTY_FORM: FormData = {
  perumahan_id: '',
  name: '',
  slug: '',
  deskripsi: '',
  badge: 'Ready Stock',
  lb: '', lt: '', kt: '', km: '',
  harga: '', harga_num: '',
  highlight: false,
}

const BADGE_OPTIONS = ['Ready Stock', 'Inden', 'Best Seller', 'Premium']
const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

// ── Helpers ──────────────────────────────────────────────────
function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function cldThumb(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_60,h_45,c_fill/${publicId}`
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', `prima-properti/${folder}`)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload Cloudinary gagal')
  const data = await res.json()
  return data.public_id as string
}

// ── Component ────────────────────────────────────────────────
export default function AdminTipePage() {
  const [tab, setTab]                     = useState<'list' | 'form'>('list')
  const [perumahanList, setPerumahanList] = useState<Perumahan[]>([])
  const [tipeList, setTipeList]           = useState<TipeRumah[]>([])
  const [filterPer, setFilterPer]         = useState('')
  const [form, setForm]                   = useState<FormData>(EMPTY_FORM)
  const [editId, setEditId]               = useState<string | null>(null)
  const [previews, setPreviews]           = useState<{ file: File; url: string }[]>([])
  const [loading, setLoading]             = useState(false)
  const [toast, setToast]                 = useState<{ msg: string; ok: boolean } | null>(null)
  const fileRef                           = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchPerumahan(); fetchTipes() }, [])

  // ── Fetching ───────────────────────────────────────────────
  async function fetchPerumahan() {
    const { data } = await supabase.from('perumahan').select('*').order('name')
    if (data) setPerumahanList(data)
  }

  async function fetchTipes() {
    const { data } = await supabase
      .from('tipe_rumah')
      .select('*, perumahan(name), galeri(url, label, urutan)')
      .order('name')
    if (data) setTipeList(data)
  }

  // ── Form helpers ───────────────────────────────────────────
  function set(key: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleNameChange(val: string) {
    setForm((prev) => ({ ...prev, name: val, slug: toSlug(val) }))
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const items = Array.from(files).map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPreviews((prev) => [...prev, ...items])
  }

  function removePreview(i: number) {
    setPreviews((prev) => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i) })
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setPreviews([])
    if (fileRef.current) fileRef.current.value = ''
  }

  function openEdit(tipe: TipeRumah) {
    setForm({
      perumahan_id: tipe.perumahan_id,
      name        : tipe.name,
      slug        : tipe.slug,
      deskripsi   : tipe.deskripsi ?? '',
      badge       : tipe.badge,
      lb          : String(tipe.lb),
      lt          : String(tipe.lt),
      kt          : tipe.kt,
      km          : String(tipe.km),
      harga       : tipe.harga,
      harga_num   : String(tipe.harga_num),
      highlight   : tipe.highlight,
    })
    setEditId(tipe.id)
    setPreviews([])
    setTab('form')
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit() {
    const { perumahan_id, name, slug, lb, lt, kt, km, harga, harga_num, badge, deskripsi, highlight } = form
    if (!perumahan_id || !name || !slug || !lb || !lt || !kt || !km || !harga || !harga_num) {
      showToast('Lengkapi semua field wajib', false); return
    }

    setLoading(true)
    try {
      const payload = {
        perumahan_id, name, slug, deskripsi, badge, highlight,
        lb: Number(lb), lt: Number(lt), kt, km: Number(km),
        harga, harga_num: Number(harga_num),
      }

      // 1. Simpan tipe_rumah
      let tipeId = editId
      if (editId) {
        const { error } = await supabase.from('tipe_rumah').update(payload).eq('id', editId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('tipe_rumah').insert(payload).select('id').single()
        if (error) throw error
        tipeId = data.id
      }

      // 2. Upload foto ke Cloudinary → simpan ke galeri
      if (previews.length > 0) {
        for (let i = 0; i < previews.length; i++) {
          const public_id = await uploadToCloudinary(previews[i].file, slug)
          await supabase.from('galeri').insert({
            tipe_id     : tipeId,
            perumahan_id: perumahan_id,
            label       : previews[i].file.name.replace(/\.[^.]+$/, ''),
            url         : public_id,
            urutan      : i,
          })
        }
      }

      showToast(editId ? 'Tipe berhasil diupdate!' : 'Tipe berhasil disimpan!')
      await fetchTipes()
      resetForm()
      setTab('list')
    } catch (err: any) {
      showToast(err?.message ?? 'Terjadi kesalahan', false)
    } finally {
      setLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Hapus tipe ini? Semua foto di galeri juga akan terhapus.')) return
    // hapus galeri dulu (kalau tidak ada cascade)
    await supabase.from('galeri').delete().eq('tipe_id', id)
    const { error } = await supabase.from('tipe_rumah').delete().eq('id', id)
    if (error) { showToast(error.message, false); return }
    showToast('Tipe berhasil dihapus!')
    await fetchTipes()
  }

  const filtered = filterPer ? tipeList.filter((t) => t.perumahan_id === filterPer) : tipeList

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 1800, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gray900)', marginBottom: '0.25rem' }}>Manajemen Tipe Rumah</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray500)' }}>Tambah, edit, dan kelola tipe rumah per perumahan.</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid var(--gray200)' }}>
        {(['list', 'form'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); if (t === 'list') resetForm() }} style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem',
            fontWeight: tab === t ? 700 : 500,
            color: tab === t ? 'var(--p2)' : 'var(--gray500)',
            background: 'transparent', border: 'none',
            borderBottom: tab === t ? '2px solid var(--p)' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: -1.5,
          }}>
            {t === 'list' ? 'Daftar Tipe Rumah' : editId ? 'Edit Tipe' : 'Tambah Tipe Baru'}
          </button>
        ))}
      </div>

      {/* ── LIST TAB ── */}
      {tab === 'list' && (
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray200)', borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1.5px solid var(--gray200)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <select value={filterPer} onChange={(e) => setFilterPer(e.target.value)} style={inputSx}>
              <option value="">Semua Perumahan</option>
              {perumahanList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={() => { resetForm(); setTab('form') }} style={{ ...btnSx, background: 'var(--p)', color: 'var(--gray900)', borderColor: 'var(--p2)' }}>
              + Tambah Tipe
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--gray50)' }}>
                  {['Nama Tipe', 'Perumahan', 'LB / LT', 'KT / KM', 'Harga', 'Badge', 'Foto', ''].map((h) => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--gray500)', fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1.5px solid var(--gray200)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray500)', fontSize: '0.88rem' }}>Belum ada tipe rumah</td></tr>
                ) : filtered.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--gray200)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--gray900)' }}>{t.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--gray500)', fontSize: '0.8rem' }}>{(t.perumahan as any)?.name ?? '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span style={tagSx}>{t.lb} / {t.lt} m²</span></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--gray700)' }}>{t.kt} KT · {t.km} KM</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--p2)' }}>{t.harga}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><BadgePill badge={t.badge} /></td>

                    {/* ── Kolom foto dari galeri ── */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {t.galeri && t.galeri.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {t.galeri
                            .sort((a, b) => a.urutan - b.urutan)
                            .slice(0, 3)
                            .map((g, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={i}
                                src={cldThumb(g.url)}
                                alt={g.label}
                                title={g.label}
                                style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--gray200)' }}
                              />
                            ))}
                          {t.galeri.length > 3 && (
                            <div style={{ width: 52, height: 40, borderRadius: 6, background: 'var(--gray100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--gray500)', fontWeight: 700, border: '1px solid var(--gray200)' }}>
                              +{t.galeri.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ ...tagSx, color: 'var(--gray400)' }}>Belum ada</span>
                      )}
                    </td>

                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEdit(t)} style={btnSx}>Edit</button>
                        <button onClick={() => handleDelete(t.id)} style={{ ...btnSx, color: '#dc2626', borderColor: '#fca5a5' }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── FORM TAB ── */}
      {tab === 'form' && (
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray200)', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '1.5rem' }}>
          <div style={gridSx}>

            <Field label="Perumahan" required full>
              <select value={form.perumahan_id} onChange={(e) => set('perumahan_id', e.target.value)} style={inputSx}>
                <option value="">Pilih perumahan...</option>
                {perumahanList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>

            <SectionLabel>Informasi Tipe</SectionLabel>

            <Field label="Nama Tipe" required>
              <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="cth. Tipe Valencia 45" style={inputSx} />
            </Field>
            <Field label="Slug (URL)" hint="Auto-generate dari nama">
              <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="tipe-valencia-45" style={{ ...inputSx, color: 'var(--gray500)' }} />
            </Field>
            <Field label="Deskripsi" full>
              <textarea value={form.deskripsi} onChange={(e) => set('deskripsi', e.target.value)} placeholder="Deskripsi singkat tipe rumah..." rows={3} style={{ ...inputSx, resize: 'vertical' }} />
            </Field>
            <Field label="Badge" required>
              <select value={form.badge} onChange={(e) => set('badge', e.target.value)} style={inputSx}>
                {BADGE_OPTIONS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Highlight di Landing Page">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', height: 36 }}>
                <input type="checkbox" id="highlight" checked={form.highlight} onChange={(e) => set('highlight', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--p)', cursor: 'pointer' }} />
                <label htmlFor="highlight" style={{ fontSize: '0.85rem', color: 'var(--gray700)', cursor: 'pointer' }}>Tampilkan sebagai unggulan</label>
              </div>
            </Field>

            <SectionLabel>Spesifikasi</SectionLabel>

            <Field label="Luas Bangunan (m²)" required>
              <input type="number" value={form.lb} onChange={(e) => set('lb', e.target.value)} placeholder="45" min="1" style={inputSx} />
            </Field>
            <Field label="Luas Tanah (m²)" required>
              <input type="number" value={form.lt} onChange={(e) => set('lt', e.target.value)} placeholder="72" min="1" style={inputSx} />
            </Field>
            <Field label="Kamar Tidur" required hint='cth: "3" atau "2+1"'>
              <input type="text" value={form.kt} onChange={(e) => set('kt', e.target.value)} placeholder="2+1" style={inputSx} />
            </Field>
            <Field label="Kamar Mandi" required>
              <input type="number" value={form.km} onChange={(e) => set('km', e.target.value)} placeholder="2" min="1" style={inputSx} />
            </Field>

            <SectionLabel>Harga</SectionLabel>

            <Field label="Harga (tampilan)" required hint='cth: "Rp 685 Juta"'>
              <input type="text" value={form.harga} onChange={(e) => set('harga', e.target.value)} placeholder="Rp 685 Juta" style={inputSx} />
            </Field>
            <Field label="Harga (angka)" required hint="Untuk filter & sorting">
              <input type="number" value={form.harga_num} onChange={(e) => set('harga_num', e.target.value)} placeholder="685000000" style={inputSx} />
            </Field>

            <SectionLabel>Foto Rumah → disimpan ke Galeri</SectionLabel>

            <div style={{ gridColumn: '1 / -1' }}>
              <div onClick={() => fileRef.current?.click()} style={{ border: '1.5px dashed var(--gray300)', borderRadius: 12, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray50)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>🖼</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray700)', marginBottom: '0.25rem' }}>Klik untuk pilih foto</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray500)' }}>PNG, JPG, WebP — bisa pilih beberapa foto sekaligus</div>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {previews.length > 0 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ width: 88, height: 66, borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--gray200)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <button onClick={() => removePreview(i)} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray500)', textAlign: 'center', marginTop: 3, width: 88, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.file.name}</div>
                  </div>
                ))}
              </div>
            )}

            {(form.slug || previews.length > 0) && (
              <div style={{ gridColumn: '1 / -1', background: 'var(--plight)', border: '1px solid #b6f5d4', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--p3)' }}>
                Upload ke Cloudinary: <code style={{ fontFamily: 'monospace', background: 'rgba(23,192,85,0.1)', padding: '1px 6px', borderRadius: 4 }}>prima-properti/{form.slug || '...'}</code>
                {previews.length > 0 && <span style={{ marginLeft: 8, color: 'var(--gray500)' }}>· {previews.length} foto dipilih → disimpan ke tabel galeri</span>}
              </div>
            )}

          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1.5px solid var(--gray200)' }}>
            <button onClick={resetForm} style={btnSx} disabled={loading}>Reset</button>
            <button onClick={() => { resetForm(); setTab('list') }} style={btnSx} disabled={loading}>Batal</button>
            <button onClick={handleSubmit} disabled={loading} style={{ ...btnSx, background: loading ? 'var(--gray200)' : 'var(--p)', color: 'var(--gray900)', borderColor: 'var(--p2)', fontWeight: 700, minWidth: 140 }}>
              {loading ? 'Menyimpan...' : editId ? 'Update Tipe' : 'Simpan Tipe Rumah'}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 12, padding: '0.75rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--gray900)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 999, animation: 'slideUp 0.2s ease' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: toast.ok ? 'var(--p)' : '#ef4444', flexShrink: 0, display: 'inline-block' }} />
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────
function Field({ label, required, hint, full, children }: { label: string; required?: boolean; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray700)' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: '0.72rem', color: 'var(--gray500)' }}>{hint}</span>}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray500)' }}>{children}</div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--gray200)' }} />
    </div>
  )
}

function BadgePill({ badge }: { badge: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Ready Stock': { bg: 'var(--plight)',  color: 'var(--p3)'   },
    'Best Seller': { bg: 'var(--tlight)',  color: 'var(--t2)'   },
    'Inden'      : { bg: '#fef9c3',        color: '#854d0e'     },
    'Premium'    : { bg: 'var(--gray900)', color: 'var(--p)'    },
  }
  const s = map[badge] ?? { bg: 'var(--gray100)', color: 'var(--gray700)' }
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>{badge}</span>
}

// ── Styles ───────────────────────────────────────────────────
const gridSx: React.CSSProperties  = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }
const inputSx: React.CSSProperties = { width: '100%', padding: '0.55rem 0.85rem', fontSize: '0.85rem', fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 10, color: 'var(--gray900)', outline: 'none' }
const btnSx: React.CSSProperties   = { padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 100, cursor: 'pointer', color: 'var(--gray700)', transition: 'all 0.15s' }
const tagSx: React.CSSProperties   = { display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: 'var(--gray100)', color: 'var(--gray700)', border: '1px solid var(--gray200)' }