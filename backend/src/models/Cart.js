import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    key:           { type: String, required: true },
    productId:     { type: String },
    slug:          { type: String },
    name:          { type: String, required: true },
    brand:         { type: String },
    image:         { type: String },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    color:         { type: String, default: "" },
    qty:           { type: Number, required: true, min: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
