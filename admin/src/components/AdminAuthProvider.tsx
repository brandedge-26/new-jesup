"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const { initAuth, isAuthenticated, isInitialized } = useAdminAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) {
            initAuth();
        }
    }, []);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isInitialized, isAuthenticated, router]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
