"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function AuthSuccessPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const token    = params.get("token");
    const userRaw  = params.get("user");

    if (!token || !userRaw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      // Manually set auth store with Google token + user
      useAuthStore.setState({ user, accessToken: token, isAuthenticated: true });
      setAccessToken(token);
      router.replace("/");
    } catch {
      router.replace("/login");
    }
  }, [params, router, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </div>
  );
}
