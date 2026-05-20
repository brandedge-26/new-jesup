import mongoose from "mongoose";

const variantOptionSchema = new mongoose.Schema({ label: { type: String } }, { _id: false });
const variantSchema       = new mongoose.Schema({ name: { type: String }, options: [variantOptionSchema] }, { _id: false });
const specificationSchema = new mongoose.Schema({ key: { type: String }, value: { type: String } }, { _id: false });

const productSchema = new mongoose.Schema(
    {
        name:          { type: String, required: true },
        description:   { type: String, default: "" },
        sku:           { type: String, default: "" },
        category:      { type: String, required: true },
        brand:         { type: String, default: "" },
        company:       { type: String, default: "" },

        price:         { type: Number, required: true },
        originalPrice: { type: Number },
        stock:         { type: Number, required: true, default: 0 },
        revenue:       { type: Number, default: 0 },

        rating:        { type: Number, default: 4.5, min: 0, max: 5 },
        reviews:       { type: Number, default: 0 },
        badge:         { type: String, enum: ["Best Seller", "Top Rated", "New", "Sale", "Limited", ""], default: "" },

        status:        { type: String, enum: ["Active", "Draft", "Out of Stock"], default: "Active" },
        inStock:       { type: Boolean, default: true },
        featured:      { type: String, enum: ["none", "trending", "new-arrival"], default: "none" },

        image:         { type: String, default: "" },
        variantImages: [{ type: String }],

        variants:       [variantSchema],
        specifications: [specificationSchema],
    },
    { timestamps: true }
);

// Auto-generate SKU if not provided
productSchema.pre("save", async function () {
    if (!this.sku) {
        const count = await mongoose.model("Product").countDocuments();
        this.sku = `JW-SKU-${String(1001 + count).padStart(4, "0")}`;
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
