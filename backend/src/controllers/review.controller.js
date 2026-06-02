import Review from "../models/Review.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

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

// GET /api/reviews  — admin: get all reviews paginated
// Query: ?page=1&limit=20
export const getAllReviews = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 20);

        const total   = await Review.countDocuments();
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("productId", "name image")
            .select("-__v");

        res.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/reviews/bulk  — admin: bulk delete reviews, body: { ids: [...] }
export const bulkDeleteReviews = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0)
            return res.status(400).json({ message: "No IDs provided" });

        // Find reviews to get affected productIds
        const reviews = await Review.find({ _id: { $in: ids } }).select("productId");
        await Review.deleteMany({ _id: { $in: ids } });

        // Recalculate rating for each affected product
        const productIds = [...new Set(reviews.map((r) => String(r.productId)))];
        await Promise.all(productIds.map(async (productId) => {
            const remaining = await Review.find({ productId });
            const avgRating = remaining.length
                ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
                : 0;
            await Product.findByIdAndUpdate(productId, {
                rating:  Math.round(avgRating * 10) / 10,
                reviews: remaining.length,
            });
        }));

        res.json({ success: true, deleted: ids.length });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/reviews/:reviewId  — admin: delete a review
export const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Recalculate product rating & review count
        const remaining = await Review.find({ productId: review.productId });
        const avgRating  = remaining.length
            ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
            : 0;

        await Product.findByIdAndUpdate(review.productId, {
            rating:  Math.round(avgRating * 10) / 10,
            reviews: remaining.length,
        });

        res.json({ message: "Review deleted" });
    } catch (err) {
        next(err);
    }
};
