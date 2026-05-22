"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAxios } from "@/lib/axios";
import type { ProductStatus, Variant, Specification } from "@/lib/mockData";

const CATEGORIES = ["Audio", "Cases", "Power", "Accessories", "Screen Protection", "Devices"];

type FeaturedType = "none" | "trending" | "new-arrival";

const FEATURED_OPTIONS: { value: FeaturedType; label: string; desc: string; color: string }[] = [
  { value: "none",        label: "None",         desc: "Regular product",                   color: "border-gray-200 text-gray-500" },
  { value: "trending",    label: "🔥 Trending",  desc: "Shows in Trending Now section",     color: "border-amber-300 text-amber-700 bg-amber-50" },
  { value: "new-arrival", label: "✨ New Arrival",desc: "Shows in New Arrivals section",    color: "border-primary text-primary bg-primary/5" },
];

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

const INPUT = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, sublabel }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sublabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full group"
    >
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-primary" : "bg-gray-200"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </button>
  );
}

// ── Image Uploads ─────────────────────────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function MainImageUpload({ value, onChange, onClear }: {
  value: string; onChange: (url: string) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChange(await readFileAsDataUrl(file));
    e.target.value = "";
  }
  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onChange(await readFileAsDataUrl(file));
  }
  return (
    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-56 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Main" className="w-full h-full object-contain" />
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => ref.current?.click()} className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-gray-700 shadow hover:bg-gray-50">Replace</button>
            <button type="button" onClick={onClear} className="px-3 py-1.5 rounded-lg bg-red-500 text-xs font-semibold text-white shadow hover:bg-red-600">Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="w-full h-56 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary/40 hover:bg-primary/[0.02] transition-colors">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">Upload main image</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · Drag & drop or click</p>
          </div>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

function VariantImageSlot({ value, onChange, onClear }: {
  value: string; onChange: (url: string) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChange(await readFileAsDataUrl(file));
    e.target.value = "";
  }
  return (
    <div className="relative group">
      {value ? (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => ref.current?.click()} className="p-1.5 rounded-lg bg-white/90 text-gray-700">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </button>
            <button type="button" onClick={onClear} className="p-1.5 rounded-lg bg-red-500/90 text-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:border-primary/40 hover:text-primary/50 hover:bg-primary/[0.02] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-medium">Add image</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}

// ── Color Tag Input ───────────────────────────────────────────────────────────

function ColorTagInput({ colors, onChange }: { colors: string[]; onChange: (colors: string[]) => void }) {
  const [input, setInput] = useState("");

  function add() {
    const val = input.trim();
    if (val && !colors.includes(val)) onChange([...colors, val]);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && colors.length) onChange(colors.slice(0, -1));
  }

  return (
    <div className={`${INPUT} min-h-[42px] h-auto flex flex-wrap gap-1.5 cursor-text`} onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
      {colors.map((c) => (
        <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
          {c}
          <button type="button" onClick={() => onChange(colors.filter((x) => x !== c))} className="text-primary/60 hover:text-primary leading-none">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={add}
        placeholder={colors.length === 0 ? "Type a color and press Enter…" : ""}
        className="flex-1 min-w-[140px] outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
      />
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface VariantRow { name: string; optionsStr: string }
interface SpecRow    { key: string;  value: string }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [desc,     setDesc]     = useState("");
  const [category, setCategory] = useState("Audio");
  const [price,    setPrice]    = useState("");
  const [origPrice,setOrigPrice]= useState("");
  const [stock,    setStock]    = useState("");
  const [status,   setStatus]   = useState<ProductStatus>("Active");
  const [brand,    setBrand]    = useState("");
  const [company,  setCompany]  = useState("");
  const [rating,   setRating]   = useState("4.5");
  const [reviews,  setReviews]  = useState("0");

  // New fields
  const [inStock,   setInStock]   = useState(true);
  const [featured,  setFeatured]  = useState<FeaturedType>("none");
  const [colors,    setColors]    = useState<string[]>([]);

  // Images
  const [mainImage,     setMainImage]     = useState("");
  const [variantImages, setVariantImages] = useState<string[]>(["", "", "", ""]);
  function setVariantImage(i: number, url: string) {
    setVariantImages((imgs) => imgs.map((v, idx) => idx === i ? url : v));
  }

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>([{ name: "Color", optionsStr: "" }]);
  function addVariant()              { setVariants((v) => [...v, { name: "", optionsStr: "" }]); }
  function removeVariant(i: number)  { setVariants((v) => v.filter((_, idx) => idx !== i)); }
  function setVField(i: number, field: keyof VariantRow, val: string) {
    setVariants((v) => v.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  // Specs
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: "", value: "" }]);
  function addSpec()             { setSpecs((s) => [...s, { key: "", value: "" }]); }
  function removeSpec(i: number) { setSpecs((s) => s.filter((_, idx) => idx !== i)); }
  function setSField(i: number, field: keyof SpecRow, val: string) {
    setSpecs((s) => s.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())                      e.name  = "Product name is required";
    if (!price || Number(price) <= 0)      e.price = "Enter a valid price";
    if (stock === "" || Number(stock) < 0) e.stock = "Enter a valid stock quantity";
    if (!mainImage)                        e.image = "Main image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSaveMsg("");

    const parsedVariants: Variant[] = variants
      .filter((v) => v.name.trim())
      .map((v) => ({
        name: v.name.trim(),
        options: v.optionsStr.split(",").map((o) => o.trim()).filter(Boolean).map((label) => ({ label })),
      }));

    const parsedSpecs: Specification[] = specs
      .filter((s) => s.key.trim())
      .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));

    const finalStatus: ProductStatus = !inStock ? "Out of Stock" : status;

    try {
      // Save to backend Products collection
      const { data: createdProduct } = await adminAxios.post("/products", {
        name:           name.trim(),
        description:    desc.trim(),
        sku:            "",
        category,
        brand:          brand.trim(),
        company:        company.trim(),
        price:          parseFloat(price),
        originalPrice:  origPrice ? parseFloat(origPrice) : undefined,
        stock:          parseInt(stock),
        status:         finalStatus,
        inStock,
        featured,
        rating:         parseFloat(rating) || 4.5,
        reviews:        parseInt(reviews)  || 0,
        badge:          featured === "new-arrival" ? "New" : featured === "trending" ? "Best Seller" : "",
        image:          mainImage,
        variantImages:  variantImages.filter(Boolean),
        colors,
        variants:       parsedVariants,
        specifications: parsedSpecs,
      });

      // If featured, also save to FeaturedProduct for home page sections
      if (featured !== "none") {
        await adminAxios.post("/featured", {
          name:          name.trim(),
          brand:         brand.trim(),
          price:         parseFloat(price),
          originalPrice: origPrice ? parseFloat(origPrice) : undefined,
          rating:        parseFloat(rating) || 4.5,
          reviews:       parseInt(reviews)  || 0,
          image:         mainImage,
          badge:         featured === "new-arrival" ? "New" : "Best Seller",
          inStock,
          type:          featured,
          slug:          createdProduct.slug || createdProduct._id,
        });
        setSaveMsg(`✅ Product saved and added to ${featured === "trending" ? "Trending Now 🔥" : "New Arrivals ✨"}!`);
      } else {
        setSaveMsg("✅ Product saved successfully!");
      }

      setTimeout(() => router.push("/products"), 1200);
    } catch {
      setSaveMsg("❌ Failed to save product. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl w-full px-4 sm:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium">Add Product</span>
      </div>

      {saveMsg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${saveMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {saveMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100">Basic Information</h2>
          <Field label="Product Name" required>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((err) => ({ ...err, name: "" })); }}
              placeholder="e.g. JBL Flip 7 Bluetooth Speaker"
              className={INPUT}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </Field>
          <Field label="Description">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Short product description…" className={`${INPUT} resize-none`} />
          </Field>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100">Media</h2>
          <MainImageUpload value={mainImage} onChange={(url) => { setMainImage(url); setErrors((e) => ({ ...e, image: "" })); }} onClear={() => setMainImage("")} />
          {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <VariantImageSlot key={i} value={variantImages[i]} onChange={(url) => setVariantImage(i, url)} onClear={() => setVariantImage(i, "")} />
            ))}
          </div>
          <p className="text-[11px] text-gray-400">Up to 4 variant images (different colors or angles).</p>
        </div>

        {/* Brand & Company */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100">Brand & Company</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Brand">
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. JBL" className={INPUT} />
            </Field>
            <Field label="Company">
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. HARMAN International" className={INPUT} />
            </Field>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price (USD)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min={0} step={0.01} value={price}
                  onChange={(e) => { setPrice(e.target.value); setErrors((err) => ({ ...err, price: "" })); }}
                  placeholder="0.00" className={`${INPUT} pl-7`} />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </Field>
            <Field label="Original Price (USD)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min={0} step={0.01} value={origPrice}
                  onChange={(e) => setOrigPrice(e.target.value)}
                  placeholder="0.00 (optional)" className={`${INPUT} pl-7`} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Strike-through price for discount display</p>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Stock Quantity" required>
              <input type="number" min={0} value={stock}
                onChange={(e) => { setStock(e.target.value); setErrors((err) => ({ ...err, stock: "" })); }}
                placeholder="0" className={INPUT} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Rating">
                <input type="number" min={0} max={5} step={0.1} value={rating} onChange={(e) => setRating(e.target.value)} className={INPUT} />
              </Field>
              <Field label="Reviews">
                <input type="number" min={0} value={reviews} onChange={(e) => setReviews(e.target.value)} className={INPUT} />
              </Field>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-1">
            <Toggle
              checked={inStock}
              onChange={setInStock}
              label="In Stock"
              sublabel={inStock ? "Product available for purchase" : "Product marked as Out of Stock"}
            />
          </div>
        </div>

        {/* Organisation */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100">Organisation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${INPUT} cursor-pointer`}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <div className="flex gap-2 mt-0.5">
                {(["Active", "Draft"] as ProductStatus[]).map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      status === s ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {/* ── Featured Section ────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Featured on Home Page</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Show this product in the Trending or New Arrivals section?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FEATURED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFeatured(opt.value)}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                  featured === opt.value
                    ? opt.color + " shadow-sm"
                    : "border-gray-100 text-gray-400 hover:border-gray-200"
                }`}
              >
                {featured === opt.value && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-current rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-sm font-bold">{opt.label}</span>
                <span className="text-[11px] leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>

          {featured !== "none" && (
            <div className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-xs ${
              featured === "trending" ? "bg-amber-50 text-amber-700" : "bg-primary/5 text-primary"
            }`}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                This product will appear in the{" "}
                <strong>{featured === "trending" ? "Trending Now 🔥" : "New Arrivals ✨"}</strong>{" "}
                section on the home page. The 3 latest products will be shown.
              </span>
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Variants</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">e.g. Color → Black, Blue, Red</p>
            </div>
            <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
          {variants.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">No variants added.</p>
          ) : (
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input value={v.name} onChange={(e) => setVField(i, "name", e.target.value)} placeholder="Type (e.g. Color)" className={`${INPUT} sm:flex-1`} />
                  <input value={v.optionsStr} onChange={(e) => setVField(i, "optionsStr", e.target.value)} placeholder="Options, comma-separated (e.g. Black, Blue, Red)" className={`${INPUT} sm:flex-[2]`} />
                  <button type="button" onClick={() => removeVariant(i)} className="self-end sm:self-auto p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Colors</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Type a color name and press Enter to add (e.g. Black, White, Blue)</p>
          </div>
          <ColorTagInput colors={colors} onChange={setColors} />
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Specifications</h2>
            <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
          {specs.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">No specifications added.</p>
          ) : (
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input value={s.key}   onChange={(e) => setSField(i, "key",   e.target.value)} placeholder="Key (e.g. Battery Life)" className={`${INPUT} sm:flex-1`} />
                  <input value={s.value} onChange={(e) => setSField(i, "value", e.target.value)} placeholder="Value (e.g. 12 hours)"   className={`${INPUT} sm:flex-1`} />
                  <button type="button" onClick={() => removeSpec(i)} className="self-end sm:self-auto p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 pb-6">
          <Link href="/products" className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                Save Product
                {featured !== "none" && (
                  <span className="ml-1 text-xs opacity-80">
                    + {featured === "trending" ? "Trending" : "New Arrival"}
                  </span>
                )}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
