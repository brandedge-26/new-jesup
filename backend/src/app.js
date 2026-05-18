import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";





// DB CONNECTION
await connectDB();


// EXPRESS APP
export const app = express();




// COOKIE PARSING
app.use(cookieParser());



// PARSING INCOMING DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




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



// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);