import mongoose from "mongoose";
import crypto    from "crypto";

const newsletterSchema = new mongoose.Schema(
    {
        email:             { type: String, required: true, unique: true, lowercase: true, trim: true },
        active:            { type: Boolean, default: true },
        unsubscribeToken:  { type: String, default: () => crypto.randomBytes(32).toString("hex"), index: true },
    },
    { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);
