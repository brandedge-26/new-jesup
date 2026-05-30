import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, unique: true },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        subtotal:   { type: Number, required: true },
        shipping:   { type: Number, required: true, default: 0 },
        discount:   { type: Number, default: 0 },
        promoCode:  { type: String, default: "" },
        total:      { type: Number, required: true },

        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },

        shippingAddress: {
            name:   { type: String, required: true },
            phone:  { type: String, required: true },
            street: { type: String, required: true },
            city:   { type: String, required: true },
            state:  { type: String, required: true },
            zip:    { type: String, required: true },
        },

        paymentMethod:   { type: String, enum: ["stripe", "cod"], default: "cod" },
        paymentStatus:   { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        paymentIntentId: { type: String, default: "" },

        tracking:          { type: String, default: "" },
        estimatedDelivery: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto-generate readable order number before saving
orderSchema.pre("save", async function () {
    if (!this.orderNumber) {
        const count = await mongoose.model("Order").countDocuments();
        this.orderNumber = `JW-${String(10001 + count).padStart(5, "0")}`;
    }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
