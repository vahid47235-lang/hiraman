'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { SiteContent } from '@/data/content'

// ── helpers ────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 10, marginBottom: 12, boxShadow: '0 1px 4px #0001' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 15, fontWeight: 600, color: '#1a2e1a',
        }}
      >
        {title}
        <span style={{ fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: '.2s' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 20px 20px' }}>{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, multiline }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean
}) {
  const shared: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid #e0e0e0',
    borderRadius: 6, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
    marginTop: 4, marginBottom: 12,
  }
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#666' }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} style={shared} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={shared} />
      }
    </div>
  )
}

function ImagePreview({ src }: { src: string }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }} />
  )
}

// ── main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'en'
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content')
    if (res.status === 401) { router.push(`/${locale}/admin`); return }
    setContent(await res.json())
  }, [router, locale])

  useEffect(() => { load() }, [load])

  async function save() {
    if (!content) return
    setSaving(true); setError('')
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else setError('Failed to save. Are you still logged in?')
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push(`/${locale}/admin`)
  }

  function update(path: string[], value: unknown) {
    setContent(prev => {
      if (!prev) return prev
      const next = structuredClone(prev) as Record<string, unknown>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cursor: any = next
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]]
      cursor[path[path.length - 1]] = value
      return next as SiteContent
    })
  }

  if (!content) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2e1a' }}>LOOTKA Admin</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Site Content Editor</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              padding: '9px 22px', background: saving ? '#aaa' : '#2d5a27',
              color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14,
            }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
          <button
            onClick={logout}
            style={{
              padding: '9px 16px', background: 'none', border: '1px solid #ddd',
              borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#666',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fde8e8', border: '1px solid #f5c6cb', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#c0392b', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── HERO ─────────────────────────────────── */}
      <Section title="🏔 Hero Section">
        <ImagePreview src={content.hero.backgroundImage} />
        <Field label="Background image URL" value={content.hero.backgroundImage} onChange={v => update(['hero', 'backgroundImage'], v)} />
        <Field label="Video URL (optional — leave blank to show image)" value={content.hero.videoUrl} onChange={v => update(['hero', 'videoUrl'], v)} />
      </Section>

      {/* ── ACCOMMODATIONS ───────────────────────── */}
      <Section title="🏡 Accommodations">
        {content.accommodations.map((unit, i) => (
          <div key={unit.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#555' }}>
              Unit {i + 1}: {unit.nameEn}
            </div>
            <ImagePreview src={unit.imageUrl} />
            <Field label="Image URL" value={unit.imageUrl} onChange={v => update(['accommodations', String(i), 'imageUrl'], v)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Name (English)" value={unit.nameEn} onChange={v => update(['accommodations', String(i), 'nameEn'], v)} />
              <Field label="Name (Persian)" value={unit.nameFa} onChange={v => update(['accommodations', String(i), 'nameFa'], v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Description (English)" value={unit.descEn ?? ''} onChange={v => update(['accommodations', String(i), 'descEn'], v)} multiline />
              <Field label="Description (Persian)" value={unit.descFa ?? ''} onChange={v => update(['accommodations', String(i), 'descFa'], v)} multiline />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Field label="Price/night (IRR)" value={String(unit.startingPriceIRR)} onChange={v => update(['accommodations', String(i), 'startingPriceIRR'], Number(v))} />
              <Field label="Max guests" value={String(unit.maxGuests)} onChange={v => update(['accommodations', String(i), 'maxGuests'], Number(v))} />
              <Field label="Area (m²)" value={String(unit.areaM2)} onChange={v => update(['accommodations', String(i), 'areaM2'], Number(v))} />
            </div>
          </div>
        ))}
      </Section>

      {/* ── EXPERIENCES ──────────────────────────── */}
      <Section title="✨ Experiences">
        {content.experiences.map((exp, i) => (
          <div key={exp.key} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#555' }}>
              {exp.titleEn}
            </div>
            <ImagePreview src={exp.image} />
            <Field label="Image URL" value={exp.image} onChange={v => update(['experiences', String(i), 'image'], v)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Title (English)" value={exp.titleEn} onChange={v => update(['experiences', String(i), 'titleEn'], v)} />
              <Field label="Title (Persian)" value={exp.titleFa} onChange={v => update(['experiences', String(i), 'titleFa'], v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Description (English)" value={exp.descEn} onChange={v => update(['experiences', String(i), 'descEn'], v)} multiline />
              <Field label="Description (Persian)" value={exp.descFa} onChange={v => update(['experiences', String(i), 'descFa'], v)} multiline />
            </div>
          </div>
        ))}
      </Section>

      {/* ── WELLNESS ─────────────────────────────── */}
      <Section title="🧘 Wellness Section">
        <ImagePreview src={content.wellness.image} />
        <Field label="Image URL" value={content.wellness.image} onChange={v => update(['wellness', 'image'], v)} />
        <Field label="Services (English, comma-separated)" value={content.wellness.servicesEn.join(', ')} onChange={v => update(['wellness', 'servicesEn'], v.split(',').map(s => s.trim()))} />
        <Field label="Services (Persian, comma-separated)" value={content.wellness.servicesFa.join(', ')} onChange={v => update(['wellness', 'servicesFa'], v.split(',').map(s => s.trim()))} />
      </Section>

      {/* ── REVIEWS ──────────────────────────────── */}
      <Section title="⭐ Guest Reviews">
        {content.reviews.map((review, i) => (
          <div key={review.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#555' }}>
              Review {i + 1}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Author (English)" value={review.authorEn} onChange={v => update(['reviews', String(i), 'authorEn'], v)} />
              <Field label="Author (Persian)" value={review.authorFa} onChange={v => update(['reviews', String(i), 'authorFa'], v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Location (English)" value={review.locationEn} onChange={v => update(['reviews', String(i), 'locationEn'], v)} />
              <Field label="Location (Persian)" value={review.locationFa} onChange={v => update(['reviews', String(i), 'locationFa'], v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Review text (English)" value={review.textEn} onChange={v => update(['reviews', String(i), 'textEn'], v)} multiline />
              <Field label="Review text (Persian)" value={review.textFa} onChange={v => update(['reviews', String(i), 'textFa'], v)} multiline />
            </div>
            <Field label="Rating (1–5)" value={String(review.rating)} onChange={v => update(['reviews', String(i), 'rating'], Number(v))} />
          </div>
        ))}
      </Section>

      {/* ── FAQ ──────────────────────────────────── */}
      <Section title="❓ FAQ">
        {content.faq.map((item, i) => (
          <div key={item.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#555' }}>
              FAQ {i + 1}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Question (English)" value={item.questionEn} onChange={v => update(['faq', String(i), 'questionEn'], v)} />
              <Field label="Question (Persian)" value={item.questionFa} onChange={v => update(['faq', String(i), 'questionFa'], v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Answer (English)" value={item.answerEn} onChange={v => update(['faq', String(i), 'answerEn'], v)} multiline />
              <Field label="Answer (Persian)" value={item.answerFa} onChange={v => update(['faq', String(i), 'answerFa'], v)} multiline />
            </div>
          </div>
        ))}
      </Section>

      {/* ── CONTACT ──────────────────────────────── */}
      <Section title="📞 Contact Info">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Phone" value={content.contact.phone} onChange={v => update(['contact', 'phone'], v)} />
          <Field label="Email" value={content.contact.email} onChange={v => update(['contact', 'email'], v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Address (English)" value={content.contact.addressEn} onChange={v => update(['contact', 'addressEn'], v)} />
          <Field label="Address (Persian)" value={content.contact.addressFa} onChange={v => update(['contact', 'addressFa'], v)} />
        </div>
      </Section>

      <div style={{ textAlign: 'center', padding: '32px 0 16px', color: '#bbb', fontSize: 12 }}>
        LOOTKA Admin — changes are saved to <code>src/data/content.override.json</code>
      </div>
    </div>
  )
}
