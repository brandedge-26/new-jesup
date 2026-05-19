import express from "express";
import {
    createAppointmentController,
    getAppointmentsController,
    getAppointmentController,
    updateAppointmentStatusController,
    deleteAppointmentController,
} from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const appointmentRoutes = express.Router();

// PUBLIC — anyone can book (auth optional)
appointmentRoutes.post("/", createAppointmentController);

// PROTECTED
appointmentRoutes.get("/", authMiddleware, getAppointmentsController);
appointmentRoutes.get("/:id", authMiddleware, getAppointmentController);
appointmentRoutes.patch("/:id/status", authMiddleware, updateAppointmentStatusController);
appointmentRoutes.delete("/:id",        authMiddleware, deleteAppointmentController);
