import mongoose from "mongoose";

const featuredProductSchema = new mongoose.Schema(
    {
        name:          { type: String, required: true },
        brand:         { type: String, required: true },
        price:         { type: Number, required: true },
        originalPrice: { type: Number },
        rating:        { type: Number, default: 4.5, min: 0, max: 5 },
        reviews:       { type: Number, default: 0 },
        image:         { type: String, required: true },
        badge:         { type: String, enum: ["Best Seller", "Top Rated", "New", "Sale", "Limited", ""], default: "" },
        colors:        [{ type: String }],
        inStock:       { type: Boolean, default: true },
        slug:          { type: String, default: "" },
        type:          { type: String, enum: ["trending", "new-arrival"], required: true },
        order:         { type: Number, default: 0 },
    },
    { timestamps: true }
);

const FeaturedProduct = mongoose.model("FeaturedProduct", featuredProductSchema);
export default FeaturedProduct;
