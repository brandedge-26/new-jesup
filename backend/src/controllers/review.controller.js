import Review from "../models/Review.js";
import Product from "../models/Product.js";

// GET /api/reviews/:productId  — get paginated reviews for a product
// Query: ?page=1&limit=6
export const getReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 6);

        const total   = await Review.countDocuments({ productId });
        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-__v");

        res.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// POST /api/reviews/:productId  — submit a review (auth required)
export const createReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { rating, title, body } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const existing = await Review.findOne({ productId, userId: req.user._id });
        if (existing) return res.status(409).json({ message: "You have already reviewed this product" });

        const review = await Review.create({
            productId,
            userId:   req.user._id,
            userName: `${req.user.fname} ${req.user.lname[0]}.`,
            rating,
            title:    title ?? "",
            body,
        });

        // Recalculate product rating & review count
        const allReviews = await Review.find({ productId });
        const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(productId, {
            rating:  Math.round(avgRating * 10) / 10,
            reviews: allReviews.length,
        });

        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};
