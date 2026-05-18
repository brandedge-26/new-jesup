import Appointment from "../models/Appointment.js";
import { createAppointmentSchema } from "../schema/appointment.schema.js";


// CREATE APPOINTMENT
const createAppointmentController = async (req, res, next) => {
    try {
        // VALIDATE
        const parsed = createAppointmentSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new Error(parsed.error.errors[0].message, { cause: { statusCode: 400 } });
        }

        // SAVE — attach userId if logged in (optional auth)
        const appointment = await Appointment.create({
            ...parsed.data,
            userId: req.user?._id ?? null,
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment,
        });

    } catch (err) {
        next(err);
    }
};


// GET ALL APPOINTMENTS (admin)
const getAppointmentsController = async (req, res, next) => {
    try {
        const appointments = await Appointment.find()
            .populate("userId", "fname lname email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments,
        });

    } catch (err) {
        next(err);
    }
};


// GET SINGLE APPOINTMENT
const getAppointmentController = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate("userId", "fname lname email");

        if (!appointment) {
            throw new Error("Appointment not found", { cause: { statusCode: 404 } });
        }

        res.status(200).json({ success: true, appointment });

    } catch (err) {
        next(err);
    }
};


// UPDATE STATUS
const updateAppointmentStatusController = async (req, res, next) => {
    try {
        const { status } = req.body;

        const validStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status", { cause: { statusCode: 400 } });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            throw new Error("Appointment not found", { cause: { statusCode: 404 } });
        }

        res.status(200).json({ success: true, appointment });

    } catch (err) {
        next(err);
    }
};


export {
    createAppointmentController,
    getAppointmentsController,
    getAppointmentController,
    updateAppointmentStatusController,
};
