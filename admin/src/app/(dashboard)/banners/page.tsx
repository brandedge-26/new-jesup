"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { adminAxios } from "@/lib/axios";

interface Banner {
  _id: string;
  desktopImage: string;
  mobileImage: string;
  badge: string;
  title: string;
  body: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
  active: boolean;
  order: number;
}

const INPUT = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Image uploader ────────────────────────────────────────────────────────────
const SIZE_HINT: Record<string, string> = {
  "Desktop Image *":          "Recommended: 1920 × 600 px",
  "Mobile Image (optional)":  "Recommended: 768 × 900 px",
};

function ImageUploader({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await adminAxios.post("/banners/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const hint = SIZE_HINT[label];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-gray-600">{label}</label>
        {hint && <span className="text-[10px] text-gray-400 font-medium">{hint}</span>}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors"
        style={{ minHeight: 120 }}
      >
        {value ? (
          <div className="relative w-full h-32">
            <Image src={value} alt="" fill className="object-cover" sizes="300px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
            {uploading ? (
              <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs">Click to upload</span>
                {hint && <span className="text-[10px] text-gray-300">{hint}</span>}
              </>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {value && (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className={`${INPUT} mt-1.5`} placeholder="Or paste image URL" />
      )}
    </div>
  );
}

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  desktopImage: "",
  mobileImage: "",
  badge: "",
  title: "",
  body: "",
  cta1Label: "Shop Now",
  cta1Href: "/collections",
  cta2Label: "",
  cta2Href: "",
  active: true,
  order: 0,
});

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BannersPage() {
  const [banners, setBanners]   = useState<Banner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Banner | null>(null);
  const [form, setForm]         = useState(emptyForm());
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const setField = (k: string, v: string | boolean | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAxios.get("/banners/all");
      setBanners(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setError("");
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      desktopImage: b.desktopImage,
      mobileImage:  b.mobileImage,
      badge:        b.badge,
      title:        b.title,
      body:         b.body,
      cta1Label:    b.cta1Label,
      cta1Href:     b.cta1Href,
      cta2Label:    b.cta2Label,
      cta2Href:     b.cta2Href,
      active:       b.active,
      order:        b.order,
    });
    setError("");
    setShowForm(true);
  };

  const save = async () => {
    if (!form.desktopImage) { setError("Desktop image is required."); return; }
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await adminAxios.put(`/banners/${editing._id}`, form);
      } else {
        await adminAxios.post("/banners", form);
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await adminAxios.put(`/banners/${b._id}`, { active: !b.active });
      load();
    } catch { /* ignore */ }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await adminAxios.delete(`/banners/${id}`);
    load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage home page hero banners</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Banner
        </button>
      </div>

      {/* Banner list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="font-semibold text-gray-700 mb-1">No banners yet</p>
          <p className="text-sm text-gray-400 mb-5">Add your first banner to show it on the home page.</p>
          <button onClick={openAdd} className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
            Add First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((b, idx) => (
            <div key={b._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row">

              {/* Desktop image preview */}
              <div className="relative w-full sm:w-64 h-40 sm:h-auto shrink-0 bg-gray-100">
                {b.desktopImage && (
                  <Image src={b.desktopImage} alt={b.title} fill className="object-cover" sizes="256px" />
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  #{idx + 1}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div>
                  {b.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-2">
                      {b.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-base leading-snug whitespace-pre-line line-clamp-2">{b.title}</h3>
                  {b.body && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.body}</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {b.cta1Label && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{b.cta1Label} → {b.cta1Href}</span>
                    )}
                    {b.cta2Label && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{b.cta2Label} → {b.cta2Href}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(b)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      b.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${b.active ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {b.active ? "Active" : "Inactive"}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(b)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteBanner(b._id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Form Modal ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">{editing ? "Edit Banner" : "Add Banner"}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form body */}
              <div className="px-6 py-5 space-y-5">

                {/* Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploader
                    label="Desktop Image *"
                    value={form.desktopImage}
                    onChange={(url) => setField("desktopImage", url)}
                  />
                  <ImageUploader
                    label="Mobile Image (optional)"
                    value={form.mobileImage}
                    onChange={(url) => setField("mobileImage", url)}
                  />
                </div>

                {/* Badge + Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Badge">
                    <input value={form.badge} onChange={(e) => setField("badge", e.target.value)}
                      className={INPUT} placeholder="e.g. New Collection" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Title *">
                      <input value={form.title} onChange={(e) => setField("title", e.target.value)}
                        className={INPUT} placeholder="e.g. Gear Up.\nStay Protected." />
                    </Field>
                  </div>
                </div>

                {/* Body */}
                <Field label="Description">
                  <textarea value={form.body} onChange={(e) => setField("body", e.target.value)}
                    className={INPUT} rows={2} placeholder="Short description text shown on banner" />
                </Field>

                {/* CTAs */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Buttons</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={form.cta1Label} onChange={(e) => setField("cta1Label", e.target.value)}
                      className={INPUT} placeholder="Button 1 label" />
                    <input value={form.cta1Href} onChange={(e) => setField("cta1Href", e.target.value)}
                      className={INPUT} placeholder="Button 1 link e.g. /collections" />
                    <input value={form.cta2Label} onChange={(e) => setField("cta2Label", e.target.value)}
                      className={INPUT} placeholder="Button 2 label (optional)" />
                    <input value={form.cta2Href} onChange={(e) => setField("cta2Href", e.target.value)}
                      className={INPUT} placeholder="Button 2 link (optional)" />
                  </div>
                </div>

                {/* Order + Active */}
                <div className="flex items-center gap-4">
                  <Field label="Display Order">
                    <input type="number" value={form.order} onChange={(e) => setField("order", Number(e.target.value))}
                      className={`${INPUT} w-24`} min={0} />
                  </Field>
                  <div className="flex items-center gap-2 mt-5">
                    <button
                      type="button"
                      onClick={() => setField("active", !form.active)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-primary" : "bg-gray-200"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className="text-sm text-gray-700 font-medium">Active</span>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Save Changes" : "Add Banner"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
