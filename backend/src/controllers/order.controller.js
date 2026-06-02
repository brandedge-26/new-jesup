import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Promo from "../models/Promo.js";
import User from "../models/User.js";
import { findValidPromo, calcDiscount } from "./promo.controller.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendAdminCancellationEmail } from "../utils/mailer.js";
import { ENV } from "../config/env.js";

const stripe = ENV.STRIPE_SECRET_KEY ? new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" }) : null;

// ── CREATE ORDER (checkout) ───────────────────────────────────────────────────
const createOrderController = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod = "cod", paymentIntentId = "" } = req.body;

        if (!items?.length) {
            throw new Error("Cart is empty", { cause: { statusCode: 400 } });
        }
        if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zip) {
            throw new Error("Complete shipping address is required", { cause: { statusCode: 400 } });
        }

        // ── Verify prices + stock from DB (never trust client) ─────────────
        const slugs = items.map((i) => i.slug).filter(Boolean);
        const dbProducts = await Product.find({ slug: { $in: slugs } }).select("slug price originalPrice inStock stock");

        const productMap = {};
        for (const p of dbProducts) productMap[p.slug] = p;

        const verifiedItems = [];
        for (const item of items) {
            const dbProduct = productMap[item.slug];
            if (!dbProduct) {
                throw new Error(`Product "${item.name}" not found.`, { cause: { statusCode: 400 } });
            }
            if (!dbProduct.inStock || dbProduct.stock < 1) {
                throw new Error(`"${item.name}" is out of stock.`, { cause: { statusCode: 400 } });
            }
            if (dbProduct.stock < item.qty) {
                throw new Error(
                    `Only ${dbProduct.stock} unit(s) of "${item.name}" available.`,
                    { cause: { statusCode: 400 } }
                );
            }
            verifiedItems.push({
                productId:     item.productId,
                slug:          item.slug,
                name:          item.name,
                brand:         item.brand,
                image:         item.image,
                color:         item.color ?? "",
                qty:           item.qty,
                price:         dbProduct.price,
                originalPrice: dbProduct.originalPrice,
            });
        }

        // ── Recalculate totals server-side ──────────────────────────────────
        const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        const shipping  = subtotal >= 50 ? 0 : 4.99;

        // ── Apply promo code (if provided) ───────────────────────────────────
        let discount  = 0;
        let promoCode = "";
        if (req.body.promoCode) {
            try {
                const promo = await findValidPromo(req.body.promoCode, subtotal);
                discount    = parseFloat(calcDiscount(promo, subtotal).toFixed(2));
                promoCode   = promo.code;
                await Promo.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
            } catch {
                // invalid promo — silently ignore, just don't apply
            }
        }

        const total = parseFloat((subtotal + shipping - discount).toFixed(2));

        // ── Stripe payment verification ──────────────────────────────────────
        let resolvedPaymentStatus = "pending";

        if (paymentMethod === "stripe") {
            if (!paymentIntentId) {
                throw new Error("Payment intent ID is required for card payments.", { cause: { statusCode: 400 } });
            }
            if (!stripe) {
                throw new Error("Stripe is not configured.", { cause: { statusCode: 503 } });
            }

            // Check this paymentIntentId hasn't already been used
            const existingOrder = await Order.findOne({ paymentIntentId });
            if (existingOrder) {
                throw new Error("This payment has already been used.", { cause: { statusCode: 400 } });
            }

            // Retrieve & verify PaymentIntent from Stripe
            const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (intent.status !== "succeeded") {
                throw new Error("Payment has not been completed.", { cause: { statusCode: 402 } });
            }

            // Verify amount matches (in cents) — prevents price manipulation
            const expectedCents = Math.round(total * 100);
            if (intent.amount !== expectedCents) {
                throw new Error("Payment amount mismatch. Please contact support.", { cause: { statusCode: 400 } });
            }

            // Verify the payment was made by this user
            if (intent.metadata?.userId && intent.metadata.userId !== req.user._id.toString()) {
                throw new Error("Payment does not belong to this account.", { cause: { statusCode: 403 } });
            }

            resolvedPaymentStatus = "paid";
        }

        const order = await Order.create({
            userId: req.user._id,
            items: verifiedItems,
            subtotal,
            shipping,
            discount,
            promoCode,
            total,
            shippingAddress,
            paymentMethod,
            paymentStatus: resolvedPaymentStatus,
            paymentIntentId,
        });

        // ── Decrement stock for each product ────────────────────────────────
        await Product.bulkWrite(
            verifiedItems.map((item) => ({
                updateOne: {
                    filter: { slug: item.slug },
                    update: [
                        { $set: { stock: { $max: [0, { $subtract: ["$stock", item.qty] }] } } },
                        { $set: { inStock: { $gt: ["$stock", 0] } } },
                    ],
                },
            }))
        );

        // ── Send order confirmation email (non-blocking) ─────────────────────
        sendOrderConfirmationEmail({
            to:    req.user.email,
            fname: req.user.fname,
            order,
        });

        res.status(201).json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// ── GET LOGGED-IN USER'S ORDERS ───────────────────────────────────────────────
const getMyOrdersController = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (err) {
        next(err);
    }
};

// ── GET SINGLE ORDER ──────────────────────────────────────────────────────────
const getOrderController = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "fname lname email");

        if (!order) throw new Error("Order not found", { cause: { statusCode: 404 } });

        // Only owner or admin can view
        const isOwner = order.userId._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) throw new Error("Forbidden", { cause: { statusCode: 403 } });

        res.status(200).json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// ── GET ALL ORDERS (admin) ────────────────────────────────────────────────────
const getAllOrdersController = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("userId", "fname lname email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (err) {
        next(err);
    }
};

// ── UPDATE STATUS (admin) ─────────────────────────────────────────────────────
const updateOrderStatusController = async (req, res, next) => {
    try {
        const { status, tracking, estimatedDelivery } = req.body;
        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status", { cause: { statusCode: 400 } });
        }

        const update = { status };
        if (tracking) update.tracking = tracking;
        if (estimatedDelivery) update.estimatedDelivery = estimatedDelivery;

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate("userId", "fname lname email");
        if (!order) throw new Error("Order not found", { cause: { statusCode: 404 } });

        // Send status update email (non-blocking)
        if (order.userId?.email) {
            sendOrderStatusEmail({
                to:                order.userId.email,
                fname:             order.userId.fname,
                orderNumber:       order.orderNumber,
                status,
                tracking:          order.tracking,
                estimatedDelivery: order.estimatedDelivery,
            });
        }

        res.status(200).json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// ── DELETE ORDER (admin) ──────────────────────────────────────────────────────
const deleteOrderController = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) throw new Error("Order not found", { cause: { statusCode: 404 } });
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (err) {
        next(err);
    }
};

// ── BULK DELETE ORDERS (admin) ────────────────────────────────────────────────
const bulkDeleteOrdersController = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0)
            return res.status(400).json({ message: "No IDs provided" });
        const result = await Order.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, deleted: result.deletedCount });
    } catch (err) {
        next(err);
    }
};

// ── TRACK ORDER BY ORDER NUMBER (public) ─────────────────────────────────────
const trackOrderController = async (req, res, next) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });
        if (!order) throw new Error("Order not found. Please check your order number.", { cause: { statusCode: 404 } });

        // Return only safe, non-sensitive fields
        res.status(200).json({
            success: true,
            order: {
                orderNumber:       order.orderNumber,
                status:            order.status,
                total:             order.total,
                itemCount:         order.items.length,
                items:             order.items.map((i) => ({ name: i.name, brand: i.brand, image: i.image, qty: i.qty, price: i.price })),
                tracking:          order.tracking,
                estimatedDelivery: order.estimatedDelivery,
                shippingName:      order.shippingAddress.name,
                shippingCity:      order.shippingAddress.city,
                createdAt:         order.createdAt,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ── CANCEL OWN ORDER (customer) ───────────────────────────────────────────────
const cancelOrderController = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "fname lname email");

        if (!order) throw new Error("Order not found.", { cause: { statusCode: 404 } });

        // Only the owner can cancel
        if (order.userId._id.toString() !== req.user._id.toString()) {
            throw new Error("Forbidden.", { cause: { statusCode: 403 } });
        }

        // Only Processing orders can be cancelled
        if (order.status !== "Processing") {
            throw new Error(`Order cannot be cancelled — it is already ${order.status}.`, { cause: { statusCode: 400 } });
        }

        order.status = "Cancelled";
        await order.save();

        // Email customer
        sendOrderStatusEmail({
            to:          order.userId.email,
            fname:       order.userId.fname,
            orderNumber: order.orderNumber,
            status:      "Cancelled",
        });

        // Email admin
        sendAdminCancellationEmail({
            orderNumber: order.orderNumber,
            customerName:  `${order.userId.fname} ${order.userId.lname}`,
            customerEmail: order.userId.email,
            total:         order.total,
        });

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

export {
    createOrderController,
    getMyOrdersController,
    getOrderController,
    getAllOrdersController,
    updateOrderStatusController,
    deleteOrderController,
    bulkDeleteOrdersController,
    trackOrderController,
    cancelOrderController,
};
