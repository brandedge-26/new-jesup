import bcrypt from "bcrypt";
import User from "../models/User.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { ENV } from "../config/env.js";
import { sendWelcomeEmail } from "../utils/mailer.js";




const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000   // 7 DAYS
};




// REGISTER CONTROLLER
const registerController = async (req, res, next) => {
    try {


        // VALIDATE REQUEST BODY
        const parsed = registerSchema.safeParse(req.body);
        const { success, data, error } = parsed;

        if (!success) {
            throw new Error(error.errors[0].message, { cause: { statusCode: 400 } });
        }

        const { fname, lname, email, password } = data;

        // CHECK EXISTING USER
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists", { cause: { statusCode: 409 } });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // SAVE USER TO DB
        const user = await User.create({ fname, lname, email, password: hashedPassword });


        // GENERATE TOKENS
        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);


        // SET REFRESH TOKEN IN COOKIE
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        // Send welcome email (non-blocking)
        sendWelcomeEmail({ to: user.email, fname: user.fname });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            accessToken,
            user: {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            },
        });

    } catch (err) {
        next(err);
    }
};




// LOGIN CONTROLLER
const loginController = async (req, res, next) => {
    try {
        // VALIDATE REQUEST BODY
        const parsed = loginSchema.safeParse(req.body);
        const { success, data, error } = parsed;

        if (!success) {
            throw new Error(error.errors[0].message, { cause: { statusCode: 400 } });
        }

        const { email, password } = data;

        // CHECK USER EXISTS
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
        }

        // COMPARE PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
        }

        // GENERATE TOKENS
        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // SET REFRESH TOKEN IN COOKIE
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};




// LOGOUT CONTROLLER
const logoutController = (req, res, next) => {
    try {
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        next(err);
    }
};




// REFRESH TOKEN CONTROLLER
const refreshTokenController = async (req, res, next) => {
    try {
        // GET REFRESH TOKEN FROM COOKIE
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new Error("Refresh token missing. Please login again.", { cause: { statusCode: 401 } });
        }

        // VERIFY REFRESH TOKEN
        const decoded = verifyRefreshToken(token);

        // CHECK USER EXISTS
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            throw new Error("User not found. Please login again.", { cause: { statusCode: 401 } });
        }

        // GENERATE NEW TOKENS
        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        // ROTATE REFRESH TOKEN IN COOKIE
        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};




// ADMIN LOGIN CONTROLLER
const adminLoginController = async (req, res, next) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        const { success, data, error } = parsed;

        if (!success) {
            throw new Error(error.errors[0].message, { cause: { statusCode: 400 } });
        }

        const { email, password } = data;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
        }

        if (user.role !== "admin") {
            throw new Error("Access denied. Admin only.", { cause: { statusCode: 403 } });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
        }

        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};




export { registerController, loginController, logoutController, refreshTokenController, adminLoginController };
