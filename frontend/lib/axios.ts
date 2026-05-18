import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";

// PUBLIC INSTANCE — no token needed (login, register, refresh)
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// PRIVATE INSTANCE — for protected routes
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// ATTACH ACCESS TOKEN TO EVERY PRIVATE REQUEST
privateAxios.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// IF 401 — try refresh, then retry original request
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token!);
    });
    failedQueue = [];
};

privateAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return privateAxios(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const res = await publicAxios.get("/auth/refresh");
            const newAccessToken = res.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return privateAxios(originalRequest);
        } catch (err) {
            processQueue(err, null);
            useAuthStore.getState().logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);
