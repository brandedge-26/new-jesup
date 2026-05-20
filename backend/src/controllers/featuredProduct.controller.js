import FeaturedProduct from "../models/FeaturedProduct.js";

// GET /api/featured?type=trending  OR  /api/featured?type=new-arrival
// Public — shop home page uses this
export const getFeatured = async (req, res, next) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const products = await FeaturedProduct.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// POST /api/featured  (admin only)
export const createFeatured = async (req, res, next) => {
    try {
        const product = await FeaturedProduct.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

// PUT /api/featured/:id  (admin only)
export const updateFeatured = async (req, res, next) => {
    try {
        const product = await FeaturedProduct.findByIdAndUpdate(
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

// DELETE /api/featured/:id  (admin only)
export const deleteFeatured = async (req, res, next) => {
    try {
        await FeaturedProduct.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
