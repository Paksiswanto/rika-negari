'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/connect'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const supabase = createClient()

const BADGE_OPTIONS = ['Ready Stock', 'Inden', 'Best Seller', 'Premium']
const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const ITEMS_PER_PAGE = 10

const EMPTY_FORM = {
  perumahan_id: '', name: '', slug: '', deskripsi: '',
  badge: 'Ready Stock', lb: '', lt: '', kt: '', km: '',
  harga: '', harga_num: '', highlight: false,
}
const EMPTY_PER = { id: '', name: '', slug: '', lokasi: '', kota: '', deskripsi: '' }

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', `prima-properti/${folder}`)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload gagal')
  return (await res.json()).public_id
}

// ── TipTap Toolbar ────────────────────────────────────────────
function TB({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      padding: '4px 8px', border: 'none', borderRadius: 6, cursor: 'pointer',
      fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
      background: active ? 'var(--p)' : 'transparent',
      color: active ? 'var(--gray900)' : 'var(--gray700)',
    }}>{children}</button>
  )
}

function RichEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit, Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Tulis deskripsi...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    const normalized = value?.startsWith('<') ? value : `<p>${value ?? ''}</p>`
    if (normalized !== editor.getHTML()) editor.commands.setContent(normalized)
  }, [value, editor])

  if (!editor) return null
  return (
    <div style={{ border: '1.5px solid var(--gray200)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', padding: '6px 8px', borderBottom: '1px solid var(--gray200)', background: 'var(--gray50)' }}>
        <TB active={editor.isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()}      title="Bold"><b>B</b></TB>
        <TB active={editor.isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()}    title="Italic"><em>I</em></TB>
        <TB active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></TB>
        <TB active={editor.isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()}    title="Strike"><s>S</s></TB>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 3px' }} />
        <TB active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2">H2</TB>
        <TB active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3">H3</TB>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 3px' }} />
        <TB active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Bullet">• List</TB>
        <TB active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered">1. List</TB>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 3px' }} />
        <TB active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()}   title="Left">≡L</TB>
        <TB active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Center">≡C</TB>
        <TB active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()}  title="Right">≡R</TB>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 3px' }} />
        <TB active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</TB>
        <TB active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</TB>
      </div>
      <div style={{ padding: '0.75rem 1rem', minHeight: 100, background: 'var(--white)', fontSize: '0.88rem', lineHeight: 1.8 }}>
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: var(--gray300); pointer-events: none; height: 0; }
        .tiptap:focus { outline: none; }
        .tiptap ul, .tiptap ol { padding-left: 1.4rem; }
        .tiptap h2 { font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0; }
        .tiptap h3 { font-size: 1rem; font-weight: 700; margin: 0.4rem 0; }
      `}</style>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<'list' | 'form' | 'perumahan'>('list')
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [tipeList, setTipeList] = useState<any[]>([])
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [filterPer, setFilterPer] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [perForm, setPerForm] = useState<any>(EMPTY_PER)
  const [perEditId, setPerEditId] = useState<string | null>(null)
  const [perLoading, setPerLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchPerumahan(); fetchTipes() }, [])

  async function fetchPerumahan() {
    const { data } = await supabase.from('perumahan').select('*').order('name')
    if (data) setPerumahanList(data)
  }
  async function fetchTipes() {
    const { data } = await supabase.from('tipe_rumah').select('*, perumahan:perumahan_id(name), galeri(url, urutan)').order('name')
    if (data) setTipeList(data)
  }

  const filtered = tipeList.filter(t => {
    const matchPer = !filterPer || t.perumahan_id === filterPer
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.perumahan?.name?.toLowerCase().includes(search.toLowerCase())
    return matchPer && matchSearch
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => setPage(1), [filterPer, search])

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setPreviews([]); if (fileRef.current) fileRef.current.value = '' }
  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  function handleFiles(files: FileList | null) {
    if (!files) return
    setPreviews(p => [...p, ...Array.from(files).map(f => ({ file: f, url: URL.createObjectURL(f) }))])
  }

  async function handleSubmit() {
    if (!form.perumahan_id || !form.name || !form.slug || !form.lb || !form.lt || !form.kt || !form.km || !form.harga || !form.harga_num) {
      showToast('Lengkapi semua field wajib', false); return
    }
    setLoading(true)
    try {
      const { id, perumahan, created_at, updated_at, galeri, ...rest } = form
      const payload = { ...rest, lb: Number(rest.lb), lt: Number(rest.lt), km: Number(rest.km), harga_num: Number(rest.harga_num) }

      let tipeId = editId
      if (editId) {
        const { error } = await supabase.from('tipe_rumah').update(payload).eq('id', editId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('tipe_rumah').insert(payload).select('id').single()
        if (error) throw error
        tipeId = data.id
      }

      for (let i = 0; i < previews.length; i++) {
        const url = await uploadToCloudinary(previews[i].file, form.slug)
        await supabase.from('galeri').insert({ tipe_id: tipeId, perumahan_id: form.perumahan_id, url, label: previews[i].file.name.replace(/\.[^.]+$/, ''), urutan: i })
      }

      showToast(editId ? 'Tipe berhasil diupdate!' : 'Tipe berhasil disimpan!')
      await fetchTipes(); resetForm(); setTab('list')
    } catch (e: any) {
      showToast(e.message, false)
    } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus tipe ini?')) return
    await supabase.from('galeri').delete().eq('tipe_id', id)
    const { error } = await supabase.from('tipe_rumah').delete().eq('id', id)
    if (error) { showToast(error.message, false); return }
    showToast('Tipe dihapus'); await fetchTipes()
  }

  async function handlePerSubmit() {
    if (!perForm.name || !perForm.lokasi) { showToast('Nama & lokasi wajib', false); return }
    setPerLoading(true)
    try {
      const payload = { ...perForm, slug: perForm.slug || toSlug(perForm.name) }
      const { id, created_at, updated_at, ...rest } = payload
      const { error } = perEditId && perEditId !== 'NEW'
        ? await supabase.from('perumahan').update(rest).eq('id', perEditId)
        : await supabase.from('perumahan').insert(rest)
      if (error) throw error
      showToast('Perumahan disimpan'); setPerEditId(null); await fetchPerumahan()
    } catch (e: any) {
      showToast(e.message, false)
    } finally { setPerLoading(false) }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--gray900)' }}>
            Rika<span style={{ color: 'var(--p2)' }}>Properti</span> Admin
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray50)' }}>Manajemen properti</div>
        </div>
        <button onClick={logout} style={{ ...btnSx, color: '#dc2626', borderColor: '#fca5a5', fontSize: '0.82rem' }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid var(--gray200)', marginBottom: 0, overflowX: 'auto' }}>
        {[
          { key: 'list', label: 'Daftar Tipe' },
          { key: 'form', label: editId ? 'Edit Tipe' : '+ Tambah Tipe' },
          { key: 'perumahan', label: 'Perumahan' },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as any); if (t.key === 'list') resetForm() }} style={{
            padding: '0.65rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap',
            fontWeight: tab === t.key ? 700 : 500,
            color: tab === t.key ? 'var(--p2)' : 'var(--gray500)',
            background: 'transparent', border: 'none',
            borderBottom: tab === t.key ? '2px solid var(--p)' : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1.5,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray200)', borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
        
        {/* ── TAB LIST ── */}
        {tab === 'list' && (
          <div>
            <div style={{ padding: '1rem', borderBottom: '1.5px solid var(--gray200)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama tipe..."
                style={{ ...inputSx, flex: 1, minWidth: 160 }}
              />
              <select value={filterPer} onChange={e => setFilterPer(e.target.value)} style={{ ...inputSx, minWidth: 160 }}>
                <option value="">Semua Perumahan</option>
                {perumahanList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {(search || filterPer) && (
                <button onClick={() => { setSearch(''); setFilterPer('') }} style={{ ...btnSx, fontSize: '0.8rem' }}>✕ Reset</button>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--gray500)', marginLeft: 'auto' }}>
                {filtered.length} tipe
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: 'var(--gray50)' }}>
                    {['Nama Tipe', 'Perumahan', 'LB/LT', 'Harga', 'Badge', 'Foto', ''].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--gray500)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1.5px solid var(--gray200)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray500)' }}>Tidak ada data</td></tr>
                  ) : paginated.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--gray200)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--gray900)' }}>{t.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--gray500)', fontSize: '0.8rem' }}>{t.perumahan?.name ?? '—'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ background: 'var(--gray100)', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                          {t.lb}/{t.lt} m²
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--p2)' }}>{t.harga}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><BadgePill badge={t.badge} /></td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {t.galeri?.length > 0
                          ? <span style={{ background: 'var(--plight)', color: 'var(--p3)', border: '1px solid #b6f5d4', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>{t.galeri.length} foto</span>
                          : <span style={{ color: 'var(--gray400)', fontSize: '0.75rem' }}>—</span>
                        }
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => {
                            setEditId(t.id)
                            setForm({ ...t, lb: String(t.lb), lt: String(t.lt), km: String(t.km), harga_num: String(t.harga_num) })
                            setTab('form')
                          }} style={btnSx}>Edit</button>
                          <button onClick={() => handleDelete(t.id)} style={{ ...btnSx, color: '#dc2626', borderColor: '#fca5a5' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--gray200)' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...btnSx, padding: '0.4rem 0.75rem', opacity: page === 1 ? 0.4 : 1 }}>‹</button>
                <span style={{ fontSize: '0.85rem' }}>{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...btnSx, padding: '0.4rem 0.75rem', opacity: page === totalPages ? 0.4 : 1 }}>›</button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB FORM TIPE ── */}
        {tab === 'form' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={gridSx}>
              <Field label="Perumahan" required full>
                <select value={form.perumahan_id} onChange={e => set('perumahan_id', e.target.value)} style={inputSx}>
                  <option value="">Pilih perumahan...</option>
                  {perumahanList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>

              <SectionLabel>Informasi Tipe</SectionLabel>
              <Field label="Nama Tipe" required>
                <input value={form.name} onChange={e => { const v = e.target.value; setForm((f: any) => ({ ...f, name: v, slug: toSlug(v) })) }} placeholder="cth. Tipe Valencia 45" style={inputSx} />
              </Field>
              <Field label="Slug (URL)" hint="Auto-generate dari nama">
                <input value={form.slug} onChange={e => set('slug', e.target.value)} style={{ ...inputSx, color: 'var(--gray500)' }} />
              </Field>
              <Field label="Deskripsi" full>
                <RichEditor value={form.deskripsi} onChange={v => set('deskripsi', v)} placeholder="Tulis deskripsi tipe rumah..." />
              </Field>
              <Field label="Badge" required>
                <select value={form.badge} onChange={e => set('badge', e.target.value)} style={inputSx}>
                  {BADGE_OPTIONS.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Highlight di Landing Page">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36 }}>
                  <input type="checkbox" id="hl" checked={form.highlight} onChange={e => set('highlight', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--p)', cursor: 'pointer' }} />
                  <label htmlFor="hl" style={{ fontSize: '0.85rem', color: 'var(--gray700)', cursor: 'pointer' }}>Tampilkan sebagai unggulan</label>
                </div>
              </Field>

              <SectionLabel>Spesifikasi</SectionLabel>
              <Field label="Luas Bangunan (m²)" required><input type="number" value={form.lb} onChange={e => set('lb', e.target.value)} style={inputSx} /></Field>
              <Field label="Luas Tanah (m²)" required><input type="number" value={form.lt} onChange={e => set('lt', e.target.value)} style={inputSx} /></Field>
              <Field label="Kamar Tidur" required hint='cth: "3" atau "2+1"'><input value={form.kt} onChange={e => set('kt', e.target.value)} style={inputSx} /></Field>
              <Field label="Kamar Mandi" required><input type="number" value={form.km} onChange={e => set('km', e.target.value)} style={inputSx} /></Field>

              <SectionLabel>Harga</SectionLabel>
              <Field label="Harga (tampilan)" required hint='cth: "Rp 685 Juta"'><input value={form.harga} onChange={e => set('harga', e.target.value)} style={inputSx} /></Field>
              <Field label="Harga (angka)" required hint="Untuk filter & sorting"><input type="number" value={form.harga_num} onChange={e => set('harga_num', e.target.value)} style={inputSx} /></Field>

              <SectionLabel>Foto Rumah</SectionLabel>
              <div style={{ gridColumn: '1/-1' }}>
                <div onClick={() => fileRef.current?.click()} style={{ border: '1.5px dashed var(--gray300)', borderRadius: 12, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray50)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>🖼</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray700)' }}>Klik untuk pilih foto</div>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
              </div>

              {previews.length > 0 && (
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {previews.map((p, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={p.url} style={{ width: 88, height: 66, objectFit: 'cover', borderRadius: 8, border: '1.5px solid var(--gray200)' }} alt="" />
                      <button onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1.5px solid var(--gray200)' }}>
              <button onClick={resetForm} style={btnSx}>Batal</button>
              <button onClick={handleSubmit} disabled={loading} style={{ ...btnSx, background: 'var(--p)', color: 'var(--gray900)', borderColor: 'var(--p2)', fontWeight: 700 }}>
                {loading ? 'Menyimpan...' : editId ? 'Update Tipe' : 'Simpan Tipe'}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB PERUMAHAN ── */}
        {tab === 'perumahan' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', borderBottom: '1.5px solid var(--gray200)' }}>
              <button onClick={() => { setPerEditId('NEW'); setPerForm(EMPTY_PER) }} style={{ ...btnSx, background: 'var(--p)' }}>+ Tambah Perumahan</button>
            </div>
            {perEditId && (
              <div style={{ padding: '1.5rem', background: 'var(--gray50)', borderBottom: '1px solid var(--gray200)' }}>
                <div style={gridSx}>
                  <Field label="Nama Perumahan" required><input value={perForm.name} onChange={e => { const v = e.target.value; setPerForm((f: any) => ({ ...f, name: v, slug: toSlug(v) })) }} style={inputSx} /></Field>
                  <Field label="Slug"><input value={perForm.slug} onChange={e => setPerForm((f: any) => ({ ...f, slug: e.target.value }))} style={inputSx} /></Field>
                  <Field label="Lokasi" required full><input value={perForm.lokasi} onChange={e => setPerForm((f: any) => ({ ...f, lokasi: e.target.value }))} style={inputSx} /></Field>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 5 }}>Deskripsi</label>
                    <RichEditor value={perForm.deskripsi} onChange={v => setPerForm((f: any) => ({ ...f, deskripsi: v }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => setPerEditId(null)} style={btnSx}>Batal</button>
                  <button onClick={handlePerSubmit} disabled={perLoading} style={{ ...btnSx, background: 'var(--p)' }}>Simpan</button>
                </div>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead><tr style={{ background: 'var(--gray50)' }}>{['Nama', 'Lokasi', ''].map(h => <th key={h} style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--gray200)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {perumahanList.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--gray200)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '1rem' }}>{p.lokasi}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}><button onClick={() => { setPerEditId(p.id); setPerForm(p) }} style={btnSx}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 12, padding: '0.75rem 1.1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 999 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: toast.ok ? 'var(--p)' : '#ef4444', display: 'inline-block', marginRight: 8 }} />
          {toast.msg}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .admin-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

// ── Shared UI Components ──────────────────────────────────────
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
    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, marginBottom: 10 }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray500)' }}>{children}</div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--gray200)' }} />
    </div>
  )
}

function BadgePill({ badge }: { badge: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Ready Stock': { bg: 'var(--plight)', color: 'var(--p3)' },
    'Best Seller': { bg: 'var(--tlight)', color: 'var(--t2)' },
    'Inden': { bg: '#fef9c3', color: '#854d0e' },
    'Premium': { bg: 'var(--gray900)', color: 'var(--p)' },
  }
  const s = map[badge] ?? { bg: 'var(--gray100)', color: 'var(--gray700)' }
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>{badge}</span>
}

const gridSx: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }
const inputSx: React.CSSProperties = { width: '100%', padding: '0.55rem 0.85rem', fontSize: '0.85rem', background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 10, outline: 'none' }
const btnSx: React.CSSProperties = { padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: 600, background: 'var(--white)', border: '1.5px solid var(--gray200)', borderRadius: 100, cursor: 'pointer' }