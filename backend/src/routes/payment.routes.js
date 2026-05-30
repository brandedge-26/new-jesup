import express from "express";
import { createPaymentIntentController, handleWebhookController } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const paymentRoutes = express.Router();

// Webhook — raw body (registered separately in app.js before express.json)
export const webhookRoute = handleWebhookController;

// Create PaymentIntent — requires auth
paymentRoutes.post("/create-intent", authMiddleware, createPaymentIntentController);
