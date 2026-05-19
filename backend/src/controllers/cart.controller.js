import Cart from "../models/Cart.js";

// ── GET CART ──────────────────────────────────────────────────────────────────
const getCartController = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        res.status(200).json({ success: true, items: cart?.items ?? [] });
    } catch (err) {
        next(err);
    }
};

// ── SYNC CART (replace server cart with client cart) ─────────────────────────
const syncCartController = async (req, res, next) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
            throw new Error("items must be an array", { cause: { statusCode: 400 } });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { items },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, items: cart.items });
    } catch (err) {
        next(err);
    }
};

// ── CLEAR CART ────────────────────────────────────────────────────────────────
const clearCartController = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }, { upsert: true });
        res.status(200).json({ success: true, items: [] });
    } catch (err) {
        next(err);
    }
};

export { getCartController, syncCartController, clearCartController };
