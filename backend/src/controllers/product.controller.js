import Product from "../models/Product.js";
import FeaturedProduct from "../models/FeaturedProduct.js";
import Order from "../models/Order.js";
import Newsletter from "../models/Newsletter.js";
import { sendNewProductNewsletter } from "../utils/mailer.js";

// GET /api/products  — all products (admin)
// Query params: category, status, search, page, limit
export const getProducts = async (req, res, next) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (category && category !== "All") filter.category = category;
        if (status   && status   !== "All") filter.status   = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku:  { $regex: search, $options: "i" } },
                { brand:{ $regex: search, $options: "i" } },
            ];
        }

        const total    = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        next(err);
    }
};

// GET /api/products/:id  — supports MongoDB _id OR slug
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isObjectId = /^[a-f\d]{24}$/i.test(id);
        const product = isObjectId
            ? (await Product.findById(id)) ?? (await Product.findOne({ slug: id }))
            : await Product.findOne({ slug: id });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// POST /api/products/upload-image  (admin) — multipart/form-data, field: "image"
export const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file provided" });
        // multer-storage-cloudinary sets req.file.path to the Cloudinary URL
        res.json({ url: req.file.path });
    } catch (err) {
        next(err);
    }
};

// POST /api/products  (admin)
export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);

        // Fire-and-forget: notify newsletter subscribers about the new product
        Newsletter.find({ active: true }).select("email unsubscribeToken").lean().then((subscribers) => {
            if (subscribers.length > 0) {
                sendNewProductNewsletter({ subscribers, product }).catch(() => {});
            }
        }).catch(() => {});
    } catch (err) {
        next(err);
    }
};

// PUT /api/products/:id  (admin)
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: "Product not found" });

        // ── Sync FeaturedProduct collection ──────────────────────────────────
        const featured = req.body.featured;
        if (featured !== undefined) {
            // Remove any existing featured entry for this product
            await FeaturedProduct.deleteMany({
                $or: [
                    { slug: product.slug },
                    { slug: String(product._id) },
                ],
            });

            // If trending or new-arrival, create a fresh entry
            if (featured === "trending" || featured === "new-arrival") {
                await FeaturedProduct.create({
                    name:          product.name,
                    brand:         product.brand ?? "",
                    price:         product.price,
                    originalPrice: product.originalPrice,
                    rating:        product.rating ?? 4.5,
                    reviews:       product.reviews ?? 0,
                    image:         product.image ?? "",
                    badge:         product.badge ?? "",
                    colors:        product.colors ?? [],
                    inStock:       product.inStock ?? true,
                    slug:          product.slug || String(product._id),
                    type:          featured,
                    order:         0,
                });
            }
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        // Also remove from featured/trending if it was featured
        if (product) {
            await FeaturedProduct.deleteMany({
                $or: [
                    { slug: product.slug },
                    { slug: String(product._id) },
                ],
            });
        }
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

// GET /api/products/bestsellers — top N products by units sold (public)
export const getBestsellers = async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 4, 20);

        // Step 1: aggregate sold qty from non-cancelled orders
        const soldData = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $unwind: "$items" },
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.qty" } } },
            { $sort: { totalSold: -1 } },
            { $limit: limit * 3 }, // fetch extra buffer to account for deleted products
        ]);

        // Step 2: only keep valid ObjectIds that still exist in Product collection
        const mongoose = (await import("mongoose")).default;
        const validIds = soldData
            .filter(d => mongoose.Types.ObjectId.isValid(d._id))
            .map(d => d._id);

        const products = await Product.find({ _id: { $in: validIds } })
            .select("_id name brand image price originalPrice rating slug")
            .lean();

        // Step 3: merge totalSold, sort, limit
        const soldMap = Object.fromEntries(soldData.map(d => [String(d._id), d.totalSold]));
        const merged = products
            .map(p => ({ ...p, totalSold: soldMap[String(p._id)] ?? 0 }))
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, limit);

        res.json(merged);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/products/bulk  (admin) — body: { ids: [...] }
export const bulkDeleteProducts = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0)
            return res.status(400).json({ message: "No IDs provided" });

        const products = await Product.find({ _id: { $in: ids } }).select("slug _id");
        await Product.deleteMany({ _id: { $in: ids } });
        const slugsAndIds = products.flatMap((p) => [p.slug, String(p._id)].filter(Boolean));
        if (slugsAndIds.length) await FeaturedProduct.deleteMany({ slug: { $in: slugsAndIds } });

        res.json({ success: true, deleted: products.length });
    } catch (err) {
        next(err);
    }
};
