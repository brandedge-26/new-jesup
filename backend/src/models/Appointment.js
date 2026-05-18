import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        // DEVICE INFO
        deviceType: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },

        // DAMAGE INFO
        damageTypes: [{ type: String, trim: true }],
        damageDescription: { type: String, trim: true, default: "" },

        // SCHEDULE
        appointmentDate: { type: String, required: true },
        appointmentTime: { type: String, required: true },

        // LOCATION
        zipCode: { type: String, trim: true, default: "" },
        streetAddress: { type: String, trim: true, default: "" },
        location: {
            lat: { type: Number },
            lng: { type: Number },
            display: { type: String },
        },

        // CUSTOMER INFO
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        marketingOptIn: { type: Boolean, default: false },

        // OPTIONAL USER LINK
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

        // STATUS
        status: {
            type: String,
            enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
