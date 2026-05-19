import Order from "../models/Order.js";

// ── CREATE ORDER (checkout) ───────────────────────────────────────────────────
const createOrderController = async (req, res, next) => {
    try {
        const { items, subtotal, shipping, total, shippingAddress } = req.body;

        if (!items?.length) {
            throw new Error("Cart is empty", { cause: { statusCode: 400 } });
        }
        if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.zip) {
            throw new Error("Complete shipping address is required", { cause: { statusCode: 400 } });
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            subtotal,
            shipping,
            total,
            shippingAddress,
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

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order) throw new Error("Order not found", { cause: { statusCode: 404 } });

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

export {
    createOrderController,
    getMyOrdersController,
    getOrderController,
    getAllOrdersController,
    updateOrderStatusController,
    deleteOrderController,
    trackOrderController,
};
