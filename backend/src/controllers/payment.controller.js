import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Promo from "../models/Promo.js";
import { ENV } from "../config/env.js";
import { findValidPromo, calcDiscount } from "./promo.controller.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });


// ── Shared helper: verify cart & calculate total (server-side) ────────────────
export async function verifyCartAndCalcTotal(items, promoCode) {
    
    if (!items?.length) throw new Error("Cart is empty", { cause: { statusCode: 400 } });

    const slugs = items.map((i) => i.slug).filter(Boolean);
    const dbProducts = await Product.find({ slug: { $in: slugs } }).select("slug price originalPrice inStock stock");

    const productMap = {};
    for (const p of dbProducts) productMap[p.slug] = p;

    const verifiedItems = [];
    for (const item of items) {
        const dbProduct = productMap[item.slug];
        if (!dbProduct) throw new Error(`Product "${item.name}" not found.`, { cause: { statusCode: 400 } });
        if (!dbProduct.inStock || dbProduct.stock < 1) throw new Error(`"${item.name}" is out of stock.`, { cause: { statusCode: 400 } });
        if (dbProduct.stock < item.qty) throw new Error(`Only ${dbProduct.stock} unit(s) of "${item.name}" available.`, { cause: { statusCode: 400 } });

        verifiedItems.push({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            brand: item.brand,
            image: item.image,
            color: item.color ?? "",
            qty: item.qty,
            price: dbProduct.price,
            originalPrice: dbProduct.originalPrice,
        });
    }

    const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal >= 50 ? 0 : 4.99;

    let discount = 0;
    let appliedPromoCode = "";
    let promoId = null;
    if (promoCode) {
        try {
            const promo = await findValidPromo(promoCode, subtotal);
            discount = parseFloat(calcDiscount(promo, subtotal).toFixed(2));
            appliedPromoCode = promo.code;
            promoId = promo._id;
        } catch {
            // invalid promo — ignore
        }
    }

    const total = parseFloat((subtotal + shipping - discount).toFixed(2));

    return { verifiedItems, subtotal, shipping, discount, appliedPromoCode, promoId, total };
}

// ── CREATE PAYMENT INTENT ─────────────────────────────────────────────────────
export const createPaymentIntentController = async (req, res, next) => {
    try {
        if (!ENV.STRIPE_SECRET_KEY) {
            throw new Error("Stripe is not configured.", { cause: { statusCode: 503 } });
        }

        const { items, promoCode } = req.body;

        const { total } = await verifyCartAndCalcTotal(items, promoCode);

        // Amount in cents (Stripe requires integer)
        const amountInCents = Math.round(total * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            metadata: {
                userId: req.user._id.toString(),
                userEmail: req.user.email,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        next(err);
    }
};

// ── STRIPE WEBHOOK ────────────────────────────────────────────────────────────
export const handleWebhookController = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (!ENV.STRIPE_WEBHOOK_SECRET || !sig) {
        return res.status(400).json({ error: "Webhook secret not configured." });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events
    switch (event.type) {
        case "payment_intent.succeeded": {
            const intent = event.data.object;
            // Backup: ensure order is marked paid (in case direct order creation failed)
            await Order.findOneAndUpdate(
                { paymentIntentId: intent.id, paymentStatus: { $ne: "paid" } },
                { paymentStatus: "paid" }
            );
            break;
        }
        case "payment_intent.payment_failed": {
            const intent = event.data.object;
            await Order.findOneAndUpdate(
                { paymentIntentId: intent.id },
                { paymentStatus: "failed" }
            );
            break;
        }
        default:
            break;
    }

    res.json({ received: true });
};
