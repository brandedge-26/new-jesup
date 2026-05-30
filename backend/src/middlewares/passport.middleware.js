import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { ENV } from "../config/env.js";

export const googleAuthSuccess = async (req, res) => {
    try {
        const { _id } = req.user;

        const user = await User.findById(_id).select("fname lname email profilePicture role");
        if (!user) {
            return res.redirect(`${ENV.CLIENT_URL}/auth-error?message=User+not+found`);
        }

        const accessToken  = generateAccessToken({ id: _id });
        const refreshToken = generateRefreshToken({ id: _id });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:   ENV.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        const userPayload = {
            _id:            user._id,
            fname:          user.fname,
            lname:          user.lname,
            email:          user.email,
            profilePicture: user.profilePicture,
            role:           user.role,
        };

        res.redirect(
            `${ENV.CLIENT_URL}/auth-success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userPayload))}`
        );
    } catch (err) {
        const message = encodeURIComponent(err.message || "Google authentication failed");
        res.redirect(`${ENV.CLIENT_URL}/auth-error?message=${message}`);
    }
};

export const googleAuthError = (err, req, res, next) => {
    console.error("Google auth error:", err.message);
    const message = encodeURIComponent(err.message || "Google authentication failed");
    return res.redirect(`${ENV.CLIENT_URL}/auth-error?message=${message}`);
};
