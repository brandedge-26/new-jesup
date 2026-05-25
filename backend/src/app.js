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
import { authMiddleware } from "./middlewares/auth.middleware.js";





// DB CONNECTION
await connectDB();


// EXPRESS APP
export const app = express();




// COOKIE PARSING
app.use(cookieParser());



// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




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
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contacts",     contactRoutes);
app.use("/api/orders",       orderRoutes);
app.use("/api/cart",         cartRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/featured",     featuredRoutes);
app.use("/api/products",     productRoutes);
app.use("/api/reviews",      reviewRoutes);



// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);