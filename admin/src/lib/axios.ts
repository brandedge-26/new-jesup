import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";

export const adminAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let _accessToken: string | null = null;

export function setAdminToken(token: string | null) {
    _accessToken = token;
}

adminAxios.interceptors.request.use((config) => {
    if (_accessToken) {
        config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
});
