import User from "../models/User.js";

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

export { getUsersController };
