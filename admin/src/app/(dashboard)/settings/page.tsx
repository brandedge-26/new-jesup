"use client";

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { adminAxios } from "@/lib/axios";

// ── Input Field ───────────────────────────────────────────────────────────────

function InputField({ label, value, onChange, type = "text", placeholder, disabled }: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, description, children }: {
  title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div className={`text-sm rounded-xl px-4 py-3 font-medium ${
      type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
    }`}>
      {message}
    </div>
  );
}

// ── Save Button ───────────────────────────────────────────────────────────────

function SaveButton({ loading, saved, onClick }: { loading: boolean; saved: boolean; onClick: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30"
        }`}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : saved ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
        {saved ? "Saved!" : loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, updateUser } = useAdminAuthStore();

  // Profile
  const [fname,    setFname]    = useState(user?.fname ?? "");
  const [lname,    setLname]    = useState(user?.lname ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved,   setProfileSaved]   = useState(false);
  const [profileError,   setProfileError]   = useState<string | null>(null);

  // Password
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwSaved,    setPwSaved]    = useState(false);
  const [pwError,    setPwError]    = useState<string | null>(null);

  async function handleProfileSave() {
    setProfileError(null);
    setProfileLoading(true);
    try {
      const res = await adminAxios.patch("/users/profile", { fname, lname });
      updateUser({ fname: res.data.user.fname, lname: res.data.user.lname });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message ?? "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSave() {
    setPwError(null);
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      await adminAxios.patch("/users/password", { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: any) {
      setPwError(err?.response?.data?.message ?? "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Profile */}
      <Section title="Profile" description="Update your name shown across the admin panel.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" value={fname} onChange={setFname} placeholder="John" />
            <InputField label="Last Name"  value={lname} onChange={setLname} placeholder="Doe" />
          </div>
          <InputField label="Email" value={user?.email ?? ""} disabled />
          {profileError && <Alert type="error" message={profileError} />}
          {profileSaved  && <Alert type="success" message="Profile updated successfully." />}
          <SaveButton loading={profileLoading} saved={profileSaved} onClick={handleProfileSave} />
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Use a strong password you don't use elsewhere.">
        <div className="space-y-4">
          <InputField label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} placeholder="••••••••" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="New Password"     type="password" value={newPw}     onChange={setNewPw}     placeholder="••••••••" />
            <InputField label="Confirm Password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="••••••••" />
          </div>
          {pwError && <Alert type="error" message={pwError} />}
          {pwSaved  && <Alert type="success" message="Password changed successfully." />}
          <SaveButton loading={pwLoading} saved={pwSaved} onClick={handlePasswordSave} />
        </div>
      </Section>

    </div>
  );
}
