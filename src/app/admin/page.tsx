'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/connect'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const supabase = createClient()

// ── TipTap Editor Component (Fixed Duplicate & Styled) ──────────────────
function RichEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Tulis deskripsi...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const timer = setTimeout(() => {
        editor.commands.setContent(value);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [value, editor])

  if (!editor) return <div style={{ padding: '1rem', color: '#ccc' }}>Memuat Editor...</div>

  return (
    <div className="tiptap-wrapper" style={{ border: '1.5px solid var(--gray200)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 5, padding: '8px', background: 'var(--gray50)', borderBottom: '1px solid var(--gray200)', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          style={{ ...btnTool, background: editor.isActive('bold') ? 'var(--p)' : 'white' }}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ ...btnTool, background: editor.isActive('italic') ? 'var(--p)' : 'white' }}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={{ ...btnTool, background: editor.isActive('underline') ? 'var(--p)' : 'white' }}>U</button>
        <div style={{ width: 1, background: '#ddd', margin: '0 5px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{ ...btnTool, background: editor.isActive('bulletList') ? 'var(--p)' : 'white' }}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={{ ...btnTool, background: editor.isActive('orderedList') ? 'var(--p)' : 'white' }}>1. List</button>
      </div>

      <div className="tiptap-content" style={{ padding: '1rem', minHeight: '180px', cursor: 'text', background: 'white' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap-content .tiptap:focus { outline: none; }
        .tiptap-content ul { padding-left: 1.5rem; margin: 0.5rem 0; list-style-type: disc !important; }
        .tiptap-content ol { padding-left: 1.5rem; margin: 0.5rem 0; list-style-type: decimal !important; }
        .tiptap-content p { margin-bottom: 0.5rem; line-height: 1.6; }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: #adb5bd; pointer-events: none; height: 0;
        }
      `}</style>
    </div>
  )
}

// ── Main Admin Component ────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<'list' | 'form' | 'perumahan'>('list')
  const [perumahanList, setPerumahanList] = useState<any[]>([])
  const [tipeList, setTipeList] = useState<any[]>([])

  // State Tipe Rumah
  const [form, setForm] = useState<any>({ perumahan_id: '', name: '', slug: '', deskripsi: '', harga: '', harga_num: '', lb: '', lt: '', kt: '', km: '', badge: 'Ready Stock', highlight: false })
  const [editId, setEditId] = useState<string | null>(null)

  // State Perumahan
  const [perForm, setPerForm] = useState<any>({ name: '', lokasi: '', slug: '', deskripsi: '', kota: '' })
  const [perEditId, setPerEditId] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { fetchPerumahan(); fetchTipes() }, [])

  async function fetchPerumahan() {
    const { data } = await supabase.from('perumahan').select('*').order('name')
    if (data) setPerumahanList(data)
  }

  async function fetchTipes() {
    const { data } = await supabase.from('tipe_rumah').select('*, perumahan(name)').order('name')
    if (data) setTipeList(data)
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // Handlers
  function openEdit(tipe: any) {
    setEditId(tipe.id)
    setForm({
      perumahan_id: tipe.perumahan_id,
      name: tipe.name,
      slug: tipe.slug,
      deskripsi: tipe.deskripsi || '',
      harga: tipe.harga,
      harga_num: String(tipe.harga_num),
      lb: String(tipe.lb),
      lt: String(tipe.lt),
      kt: tipe.kt,
      km: String(tipe.km),
      badge: tipe.badge,
      highlight: tipe.highlight
    })
    setTab('form')
  }

  function openPerEdit(p: any) {
    setPerEditId(p.id)
    setPerForm({ name: p.name, lokasi: p.lokasi, deskripsi: p.deskripsi, kota: p.kota, slug: p.slug || '' })
  }

  async function handleTipeSubmit() {
    setLoading(true)
    const payload = { ...form, lb: Number(form.lb), lt: Number(form.lt), km: Number(form.km), harga_num: Number(form.harga_num) }
    const { error } = editId
      ? await supabase.from('tipe_rumah').update(payload).eq('id', editId)
      : await supabase.from('tipe_rumah').insert(payload)

    if (!error) {
      showToast('Data berhasil disimpan');
      setTab('list');
      fetchTipes();
      setEditId(null);
      setForm({ perumahan_id: '', name: '', slug: '', deskripsi: '', harga: '', harga_num: '', lb: '', lt: '', kt: '', km: '', badge: 'Ready Stock', highlight: false });
    }
    setLoading(false)
  }

  async function handlePerSubmit() {
    setLoading(true)
    const { error } = perEditId && perEditId !== 'NEW'
      ? await supabase.from('perumahan').update(perForm).eq('id', perEditId)
      : await supabase.from('perumahan').insert(perForm)

    if (!error) { showToast('Perumahan disimpan'); setPerEditId(null); fetchPerumahan() }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard Rika Negari</h1>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', marginBottom: '2rem' }}>
        {['list', 'form', 'perumahan'].map(t => (
          <button key={t} onClick={() => setTab(t as any)} style={{ ...tabBtn, borderBottom: tab === t ? '3px solid var(--p)' : 'none' }}>
            {t === 'list' ? 'Daftar' : t === 'form' ? '+ Tipe Rumah' : 'Perumahan'}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <div style={cardSx}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left', background: '#f9f9f9' }}><th style={thSx}>Tipe Unit</th><th style={thSx}>Perumahan</th><th style={thSx}>Aksi</th></tr></thead>
            <tbody>
              {tipeList.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdSx}>{t.name}</td>
                  <td style={tdSx}>{t.perumahan?.name}</td>
                  <td style={tdSx}><button onClick={() => openEdit(t)} style={btnSmall}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'form' && (
        <div style={cardSx}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit Tipe Rumah' : 'Tambah Tipe Baru'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Field label="Pilih Perumahan">
              <select value={form.perumahan_id} onChange={e => setForm({ ...form, perumahan_id: e.target.value })} style={inputSx}>
                <option value="">Pilih...</option>
                {perumahanList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Nama Tipe Unit"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSx} /></Field>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelSx}>Deskripsi Detail</label>
              <RichEditor value={form.deskripsi} onChange={v => setForm({ ...form, deskripsi: v })} />
            </div>
          </div>
          <button onClick={handleTipeSubmit} disabled={loading} style={btnMain}>{loading ? 'Menyimpan...' : 'Simpan Data Tipe'}</button>
        </div>
      )}

      {tab === 'perumahan' && (
        <div style={cardSx}>
          <button onClick={() => { setPerEditId('NEW'); setPerForm({ name: '', lokasi: '', deskripsi: '', kota: '', slug: '' }) }} style={{ ...btnSmall, background: 'var(--p)', marginBottom: '1.5rem' }}>+ Tambah Perumahan Baru</button>

          {perEditId && (
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: 12, marginBottom: '2rem', border: '1.5px solid var(--p)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                {/* Field Nama: Mengisi Nama DAN Slug sekaligus */}
                <Field label="Nama Perumahan">
                  <input
                    value={perForm.name}
                    onChange={e => {
                      const val = e.target.value;
                      setPerForm({
                        ...perForm,
                        name: val,
                        slug: val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
                      })
                    }}
                    style={inputSx}
                    placeholder="cth: Grand Sentosa Land"
                  />
                </Field>

                {/* Field Slug: Otomatis terisi, tapi tetap bisa diedit manual kalau mau */}
                <Field label="Slug">
                  <input
                    value={perForm.slug}
                    onChange={e => setPerForm({ ...perForm, slug: e.target.value })}
                    style={{ ...inputSx, color: 'var(--gray500)' }}
                    placeholder="grand-sentosa-land"
                  />
                </Field>

                <Field label="Lokasi/Alamat">
                  <input value={perForm.lokasi} onChange={e => setPerForm({ ...perForm, lokasi: e.target.value })} style={inputSx} />
                </Field>

                <Field label="Kota">
                  <input value={perForm.kota} onChange={e => setPerForm({ ...perForm, kota: e.target.value })} style={inputSx} />
                </Field>

                <div style={{ gridColumn: '1/-1' }}>
                  <RichEditor value={perForm.deskripsi} onChange={v => setPerForm({ ...perForm, deskripsi: v })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button onClick={handlePerSubmit} style={{ ...btnSmall, background: 'var(--p)', border: 'none', flex: 1 }}>
                  Simpan Perumahan
                </button>
                <button onClick={() => setPerEditId(null)} style={{ ...btnSmall, flex: 1 }}>
                  Batal
                </button>
              </div>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left' }}><th style={thSx}>Perumahan</th><th style={thSx}>Aksi</th></tr></thead>
            <tbody>
              {perumahanList.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdSx}>{p.name} <br /> <br /><small>{p.kota}</small> <small style={{ color: '#888' }}>{p.lokasi}</small></td>
                  <td style={tdSx}><button onClick={() => openPerEdit(p)} style={btnSmall}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div style={toastSx}>{toast}</div>}
    </div>
  )
}

// --- Style Helpers ---
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><label style={labelSx}>{label}</label>{children}</div>
}

const tabBtn = { padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }
const cardSx = { background: 'white', padding: '2rem', borderRadius: 16, border: '1.5px solid #eee' }
const inputSx = { padding: '0.75rem', borderRadius: 10, border: '1.5px solid #eee', outline: 'none', fontFamily: 'inherit' }
const labelSx = { fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: 5 }
const thSx = { padding: '1rem', color: '#888', fontWeight: 500, fontSize: '0.8rem' }
const tdSx = { padding: '1rem' }
const btnSmall = { padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #eee', cursor: 'pointer', background: 'white', fontWeight: 600 }
const btnMain = { width: '100%', padding: '1rem', borderRadius: 100, border: 'none', background: '#1de264', fontWeight: 700, cursor: 'pointer', marginTop: '2rem' }
const btnTool = { padding: '4px 10px', border: '1px solid #ddd', borderRadius: 5, background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }
const toastSx: React.CSSProperties = { position: 'fixed', bottom: 20, right: 20, background: '#1de264', padding: '1rem 2rem', borderRadius: 12, fontWeight: 700, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }