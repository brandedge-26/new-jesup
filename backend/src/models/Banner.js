import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        desktopImage: { type: String, required: true },
        mobileImage:  { type: String, default: "" },
        badge:        { type: String, default: "" },
        title:        { type: String, required: true },
        body:         { type: String, default: "" },
        cta1Label:    { type: String, default: "Shop Now" },
        cta1Href:     { type: String, default: "/collections" },
        cta2Label:    { type: String, default: "" },
        cta2Href:     { type: String, default: "" },
        active:       { type: Boolean, default: true },
        order:        { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
