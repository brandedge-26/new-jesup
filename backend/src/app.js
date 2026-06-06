import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";
import { contactRoutes } from "./routes/contact.routes.js";
import { orderRoutes }   from "./routes/order.routes.js";
import { cartRoutes }    from "./routes/cart.routes.js";
import { userRoutes }        from "./routes/user.routes.js";
import { featuredRoutes }   from "./routes/featuredProduct.routes.js";
import { productRoutes }    from "./routes/product.routes.js";
import { reviewRoutes }     from "./routes/review.routes.js";
import { promoRoutes }     from "./routes/promo.routes.js";
import { analyticsRoutes } from "./routes/analytics.routes.js";
import { paymentRoutes, webhookRoute } from "./routes/payment.routes.js";
import { newsletterRoutes } from "./routes/newsletter.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import passport from "./passport/auth.passport.js";
import { authLimiter, generalLimiter } from "./middlewares/rateLimiter.js";





// DB CONNECTION
await connectDB();


// EXPRESS APP
export const app = express();




// WEBHOOK — raw body, MUST be before express.json()
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), webhookRoute);

// COOKIE PARSING
app.use(cookieParser());



// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// PASSPORT
app.use(passport.initialize());




// CORS CONFIGURATION
app.use(cors({
    origin: true, // development mein sab allow — production mein specific origin set krna
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));




// API HEALTH
app.get("/", authMiddleware, (req, res) => {
    res.end("API running...");
});




// ROUTES
app.use("/api/auth",         authLimiter,    authRoutes);
app.use("/api/appointments", generalLimiter, appointmentRoutes);
app.use("/api/contacts",     generalLimiter, contactRoutes);
app.use("/api/orders",       generalLimiter, orderRoutes);
app.use("/api/cart",         generalLimiter, cartRoutes);
app.use("/api/users",        generalLimiter, userRoutes);
app.use("/api/featured",     generalLimiter, featuredRoutes);
app.use("/api/products",     generalLimiter, productRoutes);
app.use("/api/reviews",      generalLimiter, reviewRoutes);
app.use("/api/promos",       generalLimiter, promoRoutes);
app.use("/api/analytics",   generalLimiter, analyticsRoutes);
app.use("/api/payments",    generalLimiter, paymentRoutes);
app.use("/api/newsletter",  generalLimiter, newsletterRoutes);



// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);