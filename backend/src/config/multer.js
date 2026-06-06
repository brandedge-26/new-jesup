import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// ── Product image uploads ─────────────────────────────────────────────────────
const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          "jesup/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation:  [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
    },
});

export const uploadProduct = multer({
    storage: productStorage,
    limits:  { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ── Banner image uploads ──────────────────────────────────────────────────────
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          "jesup/banners",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation:  [{ width: 1920, height: 800, crop: "limit", quality: "auto" }],
    },
});

export const uploadBanner = multer({
    storage: bannerStorage,
    limits:  { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// ── User avatar uploads ───────────────────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:          "jesup/avatars",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation:  [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    },
});

export const uploadAvatar = multer({
    storage: avatarStorage,
    limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB
});
