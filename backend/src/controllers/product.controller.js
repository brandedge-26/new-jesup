import Product from "../models/Product.js";

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

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// POST /api/products  (admin)
export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
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
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
