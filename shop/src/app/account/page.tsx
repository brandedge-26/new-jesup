"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { privateAxios } from "@/lib/axios";
import { Loader2, Package, Heart, LogOut, User, Lock, ChevronRight } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <p className={`text-sm rounded-xl px-4 py-3 font-medium ${
      type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
    }`}>
      {message}
    </p>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:bg-gray-50 disabled:text-gray-400";

// ── Profile Section ───────────────────────────────────────────────────────────

function ProfileSection() {
  const { user, updateUser } = useAuthStore();
  const [fname,   setFname]   = useState(user?.fname ?? "");
  const [lname,   setLname]   = useState(user?.lname ?? "");
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setLoading(true);
    try {
      const res = await privateAxios.patch("/users/profile", { fname, lname });
      updateUser({ fname: res.data.user.fname, lname: res.data.user.lname });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Profile</h2>
          <p className="text-xs text-gray-400">Update your name</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
            <input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Ali" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
            <input value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Khan" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
          <input value={user?.email ?? ""} disabled className={inputCls} />
        </div>
        {error  && <Alert type="error"   message={error} />}
        {saved  && <Alert type="success" message="Profile updated successfully." />}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20"}`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "✓" : null}
            {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Password Section ──────────────────────────────────────────────────────────

function PasswordSection() {
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (newPw !== confirmPw) { setError("New passwords do not match."); return; }
    if (newPw.length < 6)    { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await privateAxios.patch("/users/password", { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-400">Keep your account secure</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
        </div>
        {error && <Alert type="error"   message={error} />}
        {saved && <Alert type="success" message="Password changed successfully." />}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20"}`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "✓" : null}
            {loading ? "Updating..." : saved ? "Updated!" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { href: "/my-orders", icon: <Package className="w-4 h-4" />, label: "My Orders",  sub: "View your order history" },
  { href: "/wishlist",  icon: <Heart   className="w-4 h-4" />, label: "Wishlist",   sub: "Items you saved"         },
];

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your account</h2>
        <p className="mt-2 text-sm text-gray-400">You need to be logged in to manage your profile.</p>
        <button onClick={() => router.push("/login")}
          className="mt-6 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
          Sign in
        </button>
      </div>
    );
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Account</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-gray-400">
          Logged in as <span className="font-semibold text-gray-600">{user?.fname} {user?.lname}</span>
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {QUICK_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 hover:border-primary/30 hover:shadow-md transition-all group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {l.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{l.label}</p>
              <p className="text-xs text-gray-400 truncate">{l.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <ProfileSection />
        <PasswordSection />

        {/* Sign out */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Sign Out</p>
              <p className="text-xs text-gray-400 mt-0.5">You will be logged out of your account</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
