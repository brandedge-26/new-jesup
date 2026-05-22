import FeaturedProduct from "../models/FeaturedProduct.js";
import Product from "../models/Product.js";

// GET /api/featured?type=trending  OR  /api/featured?type=new-arrival
// Public — shop home page uses this
export const getFeatured = async (req, res, next) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const featured = await FeaturedProduct.find(filter).sort({ order: 1, createdAt: -1 });

        // Auto-filter: remove entries whose product no longer exists
        const valid = await Promise.all(
            featured.map(async (f) => {
                if (!f.slug) return null;
                const isObjectId = /^[a-f\d]{24}$/i.test(f.slug);
                const exists = await Product.findOne(
                    isObjectId
                        ? { $or: [{ _id: f.slug }, { slug: f.slug }] }
                        : { slug: f.slug }
                ).select("_id").lean();
                if (!exists) {
                    // Delete stale entry silently
                    await FeaturedProduct.findByIdAndDelete(f._id);
                    return null;
                }
                return f;
            })
        );

        res.json(valid.filter(Boolean));
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

// DELETE /api/featured/cleanup  — removes featured entries whose product was deleted
export const cleanupFeatured = async (req, res, next) => {
    try {
        const featured = await FeaturedProduct.find({});
        const toDelete = [];
        for (const f of featured) {
            const slug = f.slug;
            if (!slug) { toDelete.push(f._id); continue; }
            // Check by slug or _id
            const exists = await Product.findOne({
                $or: [{ slug }, { _id: slug.match(/^[a-f\d]{24}$/i) ? slug : null }].filter(Boolean),
            });
            if (!exists) toDelete.push(f._id);
        }
        if (toDelete.length) await FeaturedProduct.deleteMany({ _id: { $in: toDelete } });
        res.json({ deleted: toDelete.length });
    } catch (err) {
        next(err);
    }
};
