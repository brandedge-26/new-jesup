import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getAnalyticsController = async (req, res) => {
    const now = new Date();

    // Last 7 days (from start of 6 days ago to now)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Last 6 months (from start of 5 months ago)
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
        summaryData,
        weeklyData,
        monthlyData,
        categoryData,
        funnelData,
        topProducts,
        repeatCustomers,
    ] = await Promise.all([
        // Overall summary
        Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue:    { $sum: "$total" },
                    totalOrders:     { $sum: 1 },
                    cancelledOrders: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
                    avgOrderValue:   { $avg: "$total" },
                },
            },
        ]),

        // Daily revenue — last 7 days (exclude cancelled)
        Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: "Cancelled" } } },
            {
                $group: {
                    _id:    { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$total" },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        // Monthly revenue — last 6 months (exclude cancelled)
        Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: "Cancelled" } } },
            {
                $group: {
                    _id:    { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    amount: { $sum: "$total" },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        // Revenue by category (from Product.revenue field)
        Product.aggregate([
            { $group: { _id: "$category", revenue: { $sum: "$revenue" }, count: { $sum: 1 } } },
            { $sort: { revenue: -1 } },
        ]),

        // Order status counts for funnel
        Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        // Top 5 products by revenue
        Product.find({}).sort({ revenue: -1 }).limit(5).select("name category price stock revenue"),

        // Repeat customers: users with 2+ orders
        Order.aggregate([
            { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gte: 2 } } },
            { $count: "total" },
        ]),
    ]);

    // ── Summary ───────────────────────────────────────────────────────────────
    const s = summaryData[0] || { totalRevenue: 0, totalOrders: 0, cancelledOrders: 0, avgOrderValue: 0 };
    const cancelRate = s.totalOrders > 0
        ? ((s.cancelledOrders / s.totalOrders) * 100).toFixed(1)
        : "0.0";

    // ── Weekly (fill missing days) ────────────────────────────────────────────
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap = Object.fromEntries(weeklyData.map((d) => [d._id, d.amount]));
    const weekly = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        const key = d.toISOString().split("T")[0];
        return { day: dayLabels[d.getDay()], date: key, amount: weeklyMap[key] || 0 };
    });

    // ── Monthly (fill missing months) ────────────────────────────────────────
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = Object.fromEntries(monthlyData.map((d) => [d._id, d.amount]));
    const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setMonth(d.getMonth() - (5 - i));
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return { month: monthNames[d.getMonth()], key, amount: monthlyMap[key] || 0 };
    });

    // Month-over-month change
    const prevMonthAmt = monthly[monthly.length - 2]?.amount || 0;
    const curMonthAmt  = monthly[monthly.length - 1]?.amount || 0;
    const monthlyChange = prevMonthAmt > 0
        ? (((curMonthAmt - prevMonthAmt) / prevMonthAmt) * 100).toFixed(1)
        : null;

    // ── Funnel ────────────────────────────────────────────────────────────────
    const statusMap = Object.fromEntries(funnelData.map((d) => [d._id, d.count]));
    const totalOrders  = s.totalOrders;
    const confirmed    = totalOrders - (statusMap["Cancelled"] || 0);
    const shipped      = (statusMap["Shipped"] || 0) + (statusMap["Delivered"] || 0);
    const delivered    = statusMap["Delivered"] || 0;

    const funnel = [
        { label: "Orders Placed", count: totalOrders, pct: 100 },
        { label: "Confirmed",     count: confirmed,   pct: totalOrders > 0 ? Math.round((confirmed / totalOrders) * 100) : 0 },
        { label: "Shipped",       count: shipped,     pct: totalOrders > 0 ? Math.round((shipped   / totalOrders) * 100) : 0 },
        { label: "Delivered",     count: delivered,   pct: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0 },
    ];

    res.json({
        summary: {
            totalRevenue:    s.totalRevenue,
            totalOrders:     s.totalOrders,
            cancelRate,
            avgOrderValue:   Math.round(s.avgOrderValue || 0),
            repeatCustomers: repeatCustomers[0]?.total || 0,
            monthlyChange,
        },
        weekly,
        monthly,
        categories: categoryData.map((d) => ({ cat: d._id, revenue: d.revenue, count: d.count })),
        funnel,
        topProducts: topProducts.map((p) => ({
            id:       p._id,
            name:     p.name,
            category: p.category,
            price:    p.price,
            stock:    p.stock,
            revenue:  p.revenue,
        })),
    });
};
