import Promo from "../models/Promo.js";

// ── Helper: find + validate a promo ──────────────────────────────────────────
async function findValidPromo(code, subtotal) {
    const promo = await Promo.findOne({ code: code.toUpperCase().trim(), isActive: true });

    if (!promo) throw new Error("Invalid promo code.", { cause: { statusCode: 400 } });

    if (promo.expiryDate && promo.expiryDate < new Date()) {
        throw new Error("This promo code has expired.", { cause: { statusCode: 400 } });
    }
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
        throw new Error("This promo code has reached its usage limit.", { cause: { statusCode: 400 } });
    }
    if (subtotal < promo.minOrderAmount) {
        throw new Error(
            `Minimum order amount of $${promo.minOrderAmount.toFixed(2)} required for this code.`,
            { cause: { statusCode: 400 } }
        );
    }

    return promo;
}

// ── Calculate discount amount ─────────────────────────────────────────────────
export function calcDiscount(promo, subtotal) {
    if (promo.discountType === "percentage") {
        return Math.min((subtotal * promo.discountValue) / 100, subtotal);
    }
    return Math.min(promo.discountValue, subtotal);
}

// ── VALIDATE (shop — any logged-in user) ─────────────────────────────────────
const validatePromoController = async (req, res, next) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) throw new Error("Promo code is required.", { cause: { statusCode: 400 } });

        const promo          = await findValidPromo(code, subtotal ?? 0);
        const discountAmount = calcDiscount(promo, subtotal ?? 0);

        res.json({
            success: true,
            promo: {
                code:            promo.code,
                discountType:    promo.discountType,
                discountValue:   promo.discountValue,
                discountAmount:  parseFloat(discountAmount.toFixed(2)),
                minOrderAmount:  promo.minOrderAmount,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ── GET ALL (admin) ───────────────────────────────────────────────────────────
const getPromosController = async (req, res, next) => {
    try {
        const promos = await Promo.find().sort({ createdAt: -1 });
        res.json({ success: true, promos });
    } catch (err) {
        next(err);
    }
};

// ── CREATE (admin) ────────────────────────────────────────────────────────────
const createPromoController = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, usageLimit, expiryDate } = req.body;

        if (!code || !discountType || discountValue == null) {
            throw new Error("code, discountType, and discountValue are required.", { cause: { statusCode: 400 } });
        }
        if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
            throw new Error("Percentage discount must be between 1 and 100.", { cause: { statusCode: 400 } });
        }

        const promo = await Promo.create({
            code,
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount ?? 0,
            usageLimit:     usageLimit    ?? null,
            expiryDate:     expiryDate    ?? null,
        });

        res.status(201).json({ success: true, promo });
    } catch (err) {
        if (err.code === 11000) {
            err.message = "Promo code already exists.";
            err.cause   = { statusCode: 400 };
        }
        next(err);
    }
};

// ── TOGGLE ACTIVE (admin) ─────────────────────────────────────────────────────
const togglePromoController = async (req, res, next) => {
    try {
        const promo = await Promo.findById(req.params.id);
        if (!promo) throw new Error("Promo not found.", { cause: { statusCode: 404 } });

        promo.isActive = !promo.isActive;
        await promo.save();

        res.json({ success: true, promo });
    } catch (err) {
        next(err);
    }
};

// ── DELETE (admin) ────────────────────────────────────────────────────────────
const deletePromoController = async (req, res, next) => {
    try {
        const promo = await Promo.findByIdAndDelete(req.params.id);
        if (!promo) throw new Error("Promo not found.", { cause: { statusCode: 404 } });
        res.json({ success: true, message: "Promo deleted." });
    } catch (err) {
        next(err);
    }
};

export {
    validatePromoController,
    getPromosController,
    createPromoController,
    togglePromoController,
    deletePromoController,
    findValidPromo,
};
