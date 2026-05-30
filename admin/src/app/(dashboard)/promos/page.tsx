"use client";

import { useState, useEffect } from "react";
import { adminAxios } from "@/lib/axios";
import { Loader2, Trash2, ToggleLeft, ToggleRight, Plus, Tag } from "lucide-react";

interface Promo {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
}

interface FormState {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minOrderAmount: string;
  usageLimit: string;
  expiryDate: string;
}

const EMPTY_FORM: FormState = {
  code: "", discountType: "percentage", discountValue: "",
  minOrderAmount: "", usageLimit: "", expiryDate: "",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PromosPage() {
  const [promos,      setPromos]      = useState<Promo[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState<FormState>(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState("");
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [togglingId,  setTogglingId]  = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminAxios.get("/promos")
      .then((r) => setPromos(r.data.promos ?? []))
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await adminAxios.post("/promos", {
        code:           form.code,
        discountType:   form.discountType,
        discountValue:  parseFloat(form.discountValue),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
        usageLimit:     form.usageLimit     ? parseInt(form.usageLimit)       : null,
        expiryDate:     form.expiryDate     ? new Date(form.expiryDate)       : null,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || "Failed to create promo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    setTogglingId(id);
    try {
      const r = await adminAxios.patch(`/promos/${id}/toggle`);
      setPromos((prev) => prev.map((p) => p._id === id ? r.data.promo : p));
    } catch { /* ignore */ }
    finally { setTogglingId(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this promo code?")) return;
    setDeletingId(id);
    try {
      await adminAxios.delete(`/promos/${id}`);
      setPromos((prev) => prev.filter((p) => p._id !== id));
    } catch { /* ignore */ }
    finally { setDeletingId(null); }
  }

  const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all";

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{promos.length} code{promos.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setFormError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Promo
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Create Promo Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{formError}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Code *</label>
                <input required value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="SAVE20" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Discount Type *</label>
                <select required value={form.discountType} onChange={(e) => set("discountType", e.target.value as "percentage" | "fixed")} className={inputCls}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Discount Value * {form.discountType === "percentage" ? "(1–100%)" : "($)"}
                </label>
                <input required type="number" min="0.01" max={form.discountType === "percentage" ? "100" : undefined}
                  step="0.01" value={form.discountValue} onChange={(e) => set("discountValue", e.target.value)}
                  placeholder={form.discountType === "percentage" ? "20" : "10.00"} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Min Order Amount ($)</label>
                <input type="number" min="0" step="0.01" value={form.minOrderAmount}
                  onChange={(e) => set("minOrderAmount", e.target.value)} placeholder="0 (no minimum)" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Usage Limit</label>
                <input type="number" min="1" step="1" value={form.usageLimit}
                  onChange={(e) => set("usageLimit", e.target.value)} placeholder="Unlimited" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                {saving ? "Creating…" : "Create Code"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(""); }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Code", "Discount", "Min Order", "Used / Limit", "Expiry", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map((j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">No promo codes yet. Create one above.</td>
                </tr>
              ) : (
                promos.map((p) => {
                  const isExpired = p.expiryDate && new Date(p.expiryDate) < new Date();
                  const hitLimit  = p.usageLimit !== null && p.usedCount >= p.usageLimit;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg text-xs tracking-widest">{p.code}</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {p.discountType === "percentage" ? `${p.discountValue}%` : `$${p.discountValue.toFixed(2)}`}
                        <span className="ml-1.5 text-xs text-gray-400 font-normal">{p.discountType}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {p.minOrderAmount > 0 ? `$${p.minOrderAmount.toFixed(2)}` : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        <span className={hitLimit ? "text-red-500 font-semibold" : ""}>{p.usedCount}</span>
                        <span className="text-gray-300"> / </span>
                        {p.usageLimit ?? <span className="text-gray-400">∞</span>}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {p.expiryDate
                          ? <span className={isExpired ? "text-red-500 font-semibold" : ""}>{formatDate(p.expiryDate)}</span>
                          : <span className="text-gray-300">Never</span>}
                      </td>
                      <td className="px-5 py-4">
                        {isExpired || hitLimit ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-400 border border-gray-200">
                            {isExpired ? "Expired" : "Exhausted"}
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}>
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(p._id)}
                            disabled={togglingId === p._id}
                            title={p.isActive ? "Deactivate" : "Activate"}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                          >
                            {togglingId === p._id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : p.isActive
                                ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                                : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            {deletingId === p._id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
