import rateLimit from "express-rate-limit";

// ── Auth routes (login, register) — strict ────────────────────────────────────
export const authLimiter = rateLimit({
    windowMs:         15 * 60 * 1000,  // 15 minutes
    max:              20,               // max 20 attempts per 15 min
    message:          { success: false, message: "Too many attempts. Please try again after 15 minutes." },
    standardHeaders:  true,
    legacyHeaders:    false,
});

// ── General API — loose ───────────────────────────────────────────────────────
export const generalLimiter = rateLimit({
    windowMs:         60 * 1000,        // 1 minute
    max:              100,              // max 100 requests per minute
    message:          { success: false, message: "Too many requests. Please slow down." },
    standardHeaders:  true,
    legacyHeaders:    false,
});
