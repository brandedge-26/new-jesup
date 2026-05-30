import bcrypt from "bcrypt";
import User from "../models/User.js";

// UPDATE profile (fname, lname)
const updateProfileController = async (req, res, next) => {
    try {
        const { fname, lname } = req.body;
        if (!fname?.trim() || !lname?.trim()) {
            throw new Error("First and last name are required.", { cause: { statusCode: 400 } });
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { fname: fname.trim(), lname: lname.trim() },
            { new: true, select: "fname lname email role" }
        );
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// CHANGE password
const changePasswordController = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new Error("All fields are required.", { cause: { statusCode: 400 } });
        }
        if (newPassword.length < 6) {
            throw new Error("New password must be at least 6 characters.", { cause: { statusCode: 400 } });
        }

        const user = await User.findById(req.user._id);
        if (!user.password) {
            throw new Error("Password change not available for OAuth accounts.", { cause: { statusCode: 400 } });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect.", { cause: { statusCode: 401 } });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password updated successfully." });
    } catch (err) {
        next(err);
    }
};

// GET all customers (admin only)
const getUsersController = async (req, res, next) => {
    try {
        const users = await User.aggregate([
            { $match: { role: "user" } },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "userId",
                    as: "orders",
                },
            },
            {
                $addFields: {
                    orderCount:    { $size: "$orders" },
                    totalSpent:    { $sum: "$orders.total" },
                    lastOrderDate: { $max: "$orders.createdAt" },
                },
            },
            { $project: { password: 0, orders: 0 } },
            { $sort: { createdAt: -1 } },
        ]);

        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

export { getUsersController, updateProfileController, changePasswordController };
