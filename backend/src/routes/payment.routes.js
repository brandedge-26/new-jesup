import express from "express";
import {
    createPaymentIntentController,
    handleWebhookController,
    createPayPalOrder,
    capturePayPalOrder,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const paymentRoutes = express.Router();

// Webhook — raw body (registered separately in app.js before express.json)
export const webhookRoute = handleWebhookController;

// Stripe — Create PaymentIntent
paymentRoutes.post("/create-intent", authMiddleware, createPaymentIntentController);

// PayPal — Create order
paymentRoutes.post("/paypal/create-order", authMiddleware, createPayPalOrder);

// PayPal — Capture order (payment confirmed)
paymentRoutes.post("/paypal/capture-order", authMiddleware, capturePayPalOrder);
