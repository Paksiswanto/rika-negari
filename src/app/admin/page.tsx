'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/utils/connect'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const supabase = createClient()

// ── Types ─────────────────────────────────────────────────────
interface Perumahan {
  id: string; name: string; slug: string; lokasi: string; kota?: string; deskripsi?: string
}

interface TipeRumah {
  id: string; perumahan_id: string; slug: string; name: string; lb: number; lt: number;
  kt: string; km: number; harga: string; harga_num: number;
  badge: string; highlight: boolean; deskripsi: string; perumahan?: { name: string }; galeri?: any[]
}

// ── Constants ─────────────────────────────────────────────────
const BADGE_OPTIONS = ['Ready Stock', 'Inden', 'Best Seller', 'Premium']
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

const EMPTY_FORM = {
  perumahan_id: '', name: '', slug: '', deskripsi: '',
  badge: 'Ready Stock', lb: '', lt: '', kt: '', km: '',
  harga: '', harga_num: '', highlight: false,
}

const EMPTY_PER_FORM = { id: '', name: '', slug: '', lokasi: '', kota: '', deskripsi: '' }

// ── Helpers ───────────────────────────────────────────────────
function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', `prima-properti/${folder}`)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload Cloudinary gagal')
  const data = await res.json()
  return data.public_id
}
function ToolbarBtn({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: '4px 8px', border: 'none', borderRadius: 6, cursor: 'pointer',
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600,
        background: active ? 'var(--p)' : 'transparent',
        color: active ? 'var(--gray900)' : 'var(--gray700)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

// ── TipTap Editor Component ───────────────────────────────────
function RichEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const editor = useEditor({
  immediatelyRender: false,   
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: placeholder ?? 'Tulis deskripsi...' }),
  ],
  content: value,
  onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    // Kalau value bukan HTML, wrap jadi <p>
    const normalized = value?.startsWith('<') ? value : <p>${value ?? ''}</p>
    if (normalized !== current) {
      editor.commands.setContent(normalized)
    }
  }, [value, editor])
  if (!editor) return null

  return (
    <div style={{ border: '1.5px solid var(--gray200)', borderRadius: 10, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 2, flexWrap: 'wrap', padding: '6px 8px',
        borderBottom: '1px solid var(--gray200)', background: 'var(--gray50)',
      }}>
        <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></ToolbarBtn>
        <ToolbarBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></ToolbarBtn>
        <ToolbarBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strike"><s>S</s></ToolbarBtn>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 4px' }} />
        <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">H2</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">H3</ToolbarBtn>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 4px' }} />
        <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">• List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">1. List</ToolbarBtn>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 4px' }} />
        <ToolbarBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">≡L</ToolbarBtn>
        <ToolbarBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">≡C</ToolbarBtn>
        <ToolbarBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">≡R</ToolbarBtn>
        <div style={{ width: 1, background: 'var(--gray200)', margin: '0 4px' }} />
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">↩️</ToolbarBtn>
        <ToolbarBtn active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">↪️</ToolbarBtn>
      </div>
      {/* Editor area */}
      <div style={{ padding: '0.75rem 1rem', minHeight: 120, background: 'var(--white)', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--gray900)' }}>
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: var(--gray300); pointer-events: none; height: 0;
        }
        .tiptap:focus { outline: none; }
        .tiptap ul { padding-left: 1.4rem; }
        .tiptap ol { padding-left: 1.4rem; }
        .tiptap h2 { font-size: 1.2rem; font-weight: 700; margin: 0.5rem 0; }
        .tiptap h3 { font-size: 1rem; font-weight: 700; margin: 0.4rem 0; }
      `}</style>
    </div>
  )
}

// ── Main Admin Component ──────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<'list' | 'form' | 'perumahan'>('list')
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [tipeList, setTipeList] = useState<any[]>([])
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [perForm, setPerForm] = useState<any>(EMPTY_PER_FORM)
  const [perEditId, setPerEditId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchPerumahan(); fetchTipes() }, [])

  async function fetchPerumahan() {
    const { data } = await supabase.from('perumahan').select('*').order('name')
    if (data) setPerumahanList(data)
  }
  async function fetchTipes() {
    const { data } = await supabase.from('tipe_rumah').select('*, perumahan(name)').order('name')
    if (data) setTipeList(data)
  }

  const set = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }))
  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setPreviews([]) }
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function handleFiles(files: FileList | null) {
    if (!files) return
    setPreviews(prev => [...prev, ...Array.from(files).map(file => ({ file, url: URL.createObjectURL(file) }))])
  }
  function removePreview(i: number) { setPreviews(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = { ...form, lb: Number(form.lb), lt: Number(form.lt), km: Number(form.km), harga_num: Number(form.harga_num) }
      let id = editId
      if (editId) {
        await supabase.from('tipe_rumah').update(payload).eq('id', editId)
      }else {
      const { data, error } = await supabase.from('tipe_rumah').insert(payload).select('id').single()

      if (error) throw error
      if (!data) throw new Error('Gagal mendapatkan ID tipe rumah baru')

      id = data.id
    }

      
      if (previews.length > 0) {
        for (const p of previews) {
          const url = await uploadToCloudinary(p.file, form.slug)
          await supabase.from('galeri').insert({ tipe_id: id, perumahan_id: form.perumahan_id, url, label: p.file.name })
        }
      }
      showToast('Berhasil disimpan!'); setTab('list'); fetchTipes(); resetForm()
    } catch (e: any) { showToast(e.message) } finally { setLoading(false) }
  }

  async function handlePerSubmit() {
    const payload = { ...perForm, slug: perForm.slug || toSlug(perForm.name) }
    const { error } = perEditId && perEditId !== 'NEW'
      ? await supabase.from('perumahan').update(payload).eq('id', perEditId)
      : await supabase.from('perumahan').insert(payload)
    if (!error) { showToast('Perumahan disimpan'); setPerEditId(null); fetchPerumahan() }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--gray200)', marginBottom: '2rem' }}>
        <button onClick={() => setTab('list')} style={{ ...tabBtnSx, borderBottom: tab === 'list' ? '2px solid var(--p)' : 'none' }}>Daftar</button>
        <button onClick={() => { setTab('form'); resetForm() }} style={{ ...tabBtnSx, borderBottom: tab === 'form' ? '2px solid var(--p)' : 'none' }}>+ Tambah Tipe</button>
        <button onClick={() => setTab('perumahan')} style={{ ...tabBtnSx, borderBottom: tab === 'perumahan' ? '2px solid var(--p)' : 'none' }}>Perumahan</button>
      </div>

      {tab === 'list' && (
        <div style={cardSx}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left', background: 'var(--gray50)' }}><th style={thSx}>Tipe</th><th style={thSx}>Perumahan</th><th style={thSx}>Aksi</th></tr></thead>
            <tbody>
              {tipeList.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--gray200)' }}>
                  <td style={tdSx}>{t.name}</td>
                  <td style={tdSx}>{t.perumahan?.name}</td>
                  <td style={tdSx}><button onClick={() => { setEditId(t.id); setForm({ ...t, lb: String(t.lb), lt: String(t.lt), km: String(t.km), harga_num: String(t.harga_num) }); setTab('form') }} style={btnSx}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'form' && (
        <div style={cardSx}>
          <div style={gridSx}>
            <Field label="Perumahan" required full>
              <select value={form.perumahan_id} onChange={e => set('perumahan_id', e.target.value)} style={inputSx}>
                <option value="">Pilih perumahan...</option>
                {perumahanList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>

            <SectionLabel>INFORMASI TIPE</SectionLabel>
            <Field label="Nama Tipe" required>
              <input value={form.name} onChange={e => { const v = e.target.value; setForm((f: any) => ({ ...f, name: v, slug: toSlug(v) })) }} style={inputSx} />
            </Field>
            <Field label="Slug (URL)" hint="Auto-generate dari nama">
              <input value={form.slug} onChange={e => set('slug', e.target.value)} style={inputSx} />
            </Field>

            <Field label="Deskripsi" full>
              <RichEditor value={form.deskripsi} onChange={v => set('deskripsi', v)} />
            </Field>

            <Field label="Badge" required>
              <select value={form.badge} onChange={e => set('badge', e.target.value)} style={inputSx}>
                {BADGE_OPTIONS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Highlight di Landing Page">
              <input type="checkbox" checked={form.highlight} onChange={e => set('highlight', e.target.checked)} />
            </Field>

            <SectionLabel>SPESIFIKASI</SectionLabel>
            <Field label="Luas Bangunan (m²)" required><input type="number" value={form.lb} onChange={e => set('lb', e.target.value)} style={inputSx} /></Field>
            <Field label="Luas Tanah (m²)" required><input type="number" value={form.lt} onChange={e => set('lt', e.target.value)} style={inputSx} /></Field>
            <Field label="Kamar Tidur" required hint='cth: "3" atau "2+1"'><input value={form.kt} onChange={e => set('kt', e.target.value)} style={inputSx} /></Field>
            <Field label="Kamar Mandi" required><input type="number" value={form.km} onChange={e => set('km', e.target.value)} style={inputSx} /></Field>

            <SectionLabel>HARGA</SectionLabel>
            <Field label="Harga (tampilan)" required hint='cth: "Rp 685 Juta"'><input value={form.harga} onChange={e => set('harga', e.target.value)} style={inputSx} /></Field>
            <Field label="Harga (angka)" required hint="Untuk filter & sorting"><input type="number" value={form.harga_num} onChange={e => set('harga_num', e.target.value)} style={inputSx} /></Field>

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
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={p.url} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8 }} alt="" />
                    <button onClick={() => removePreview(i)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: '2rem' }}>
            <button onClick={resetForm} style={btnSx}>Reset</button>
            <button onClick={handleSubmit} disabled={loading} style={{ ...btnSx, background: 'var(--p)', fontWeight: 700 }}>{loading ? 'Menyimpan...' : 'Simpan Tipe Rumah'}</button>
          </div>
        </div>
      )}

      {tab === 'perumahan' && (
        <div style={cardSx}>
          <button onClick={() => { setPerEditId('NEW'); setPerForm(EMPTY_PER_FORM) }} style={{ ...btnSx, background: 'var(--p)', marginBottom: '1rem' }}>+ Tambah Perumahan</button>
          {perEditId && (
            <div style={{ background: 'var(--gray50)', padding: '1.5rem', borderRadius: 12, border: '1.5px solid var(--p)', marginBottom: '1rem' }}>
              <div style={gridSx}>
                <Field label="Nama"><input value={perForm.name} onChange={e => { const v = e.target.value; setPerForm((f: any) => ({ ...f, name: v, slug: toSlug(v) })) }} style={inputSx} /></Field>
                <Field label="Slug"><input value={perForm.slug} onChange={e => setPerForm((f: any) => ({ ...f, slug: e.target.value }))} style={inputSx} /></Field>
                <Field label="Lokasi"><input value={perForm.lokasi} onChange={e => setPerForm((f: any) => ({ ...f, lokasi: e.target.value }))} style={inputSx} /></Field>
                <Field label="Kota"><input value={perForm.kota} onChange={e => setPerForm((f: any) => ({ ...f, kota: e.target.value }))} style={inputSx} /></Field>
                <div style={{ gridColumn: '1/-1' }}><RichEditor value={perForm.deskripsi} onChange={v => setPerForm((f: any) => ({ ...f, deskripsi: v }))} /></div>
              </div>
              <button onClick={handlePerSubmit} style={{ ...btnSx, background: 'var(--p)', marginTop: '1rem' }}>Simpan Perumahan</button>
            </div>
          )}
          {perumahanList.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
              <span>{p.name} - <small>{p.lokasi}</small></span>
              <button onClick={() => { setPerEditId(p.id); setPerForm(p) }} style={btnSx}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--p)', padding: '1rem', borderRadius: 12, fontWeight: 700 }}>{toast}</div>}
    </div>
  )
}

// ── Shared UI Components ──────────────────────────────────────
function Field({ label, required, hint, full, children }: { label: string; required?: boolean; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={labelSx}>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      {children}
      {hint && <span style={{ fontSize: '0.7rem', color: '#888' }}>{hint}</span>}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: 5 }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888' }}>{children}</span>
    </div>
  )
}

const tabBtnSx = { padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }
const cardSx = { background: 'white', padding: '2rem', borderRadius: 16, border: '1.5px solid var(--gray200)' }
const inputSx = { padding: '0.75rem', borderRadius: 10, border: '1.5px solid var(--gray200)', outline: 'none' }
const labelSx = { fontSize: '0.85rem', fontWeight: 600, color: '#444' }
const thSx = { padding: '1rem', color: '#888', fontWeight: 500 }
const tdSx = { padding: '1rem' }
const btnSx = { padding: '0.6rem 1.2rem', borderRadius: 100, border: '1.5px solid var(--gray200)', background: 'white', cursor: 'pointer', fontWeight: 600 }
const btnToolSx = { padding: '5px 10px', border: '1px solid #ddd', borderRadius: 5, background: 'white', cursor: 'pointer' }
const gridSx = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }