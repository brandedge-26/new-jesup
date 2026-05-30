import express from "express";
import {
    createAppointmentController,
    getAppointmentsController,
    getAppointmentController,
    updateAppointmentStatusController,
    deleteAppointmentController,
} from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const appointmentRoutes = express.Router();

// PUBLIC — anyone can book
appointmentRoutes.post("/", createAppointmentController);

// Admin only
appointmentRoutes.get("/",             authMiddleware, adminMiddleware, getAppointmentsController);
appointmentRoutes.get("/:id",          authMiddleware, adminMiddleware, getAppointmentController);
appointmentRoutes.patch("/:id/status", authMiddleware, adminMiddleware, updateAppointmentStatusController);
appointmentRoutes.delete("/:id",       authMiddleware, adminMiddleware, deleteAppointmentController);
