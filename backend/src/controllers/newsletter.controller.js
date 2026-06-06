import Newsletter from "../models/Newsletter.js";

// POST /api/newsletter/subscribe  (public)
export const subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ message: "Valid email is required." });

        const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });

        if (existing) {
            if (!existing.active) {
                existing.active = true;
                await existing.save();
                return res.json({ message: "You've been resubscribed! Welcome back." });
            }
            return res.json({ message: "You're already subscribed!" });
        }

        await Newsletter.create({ email });
        res.status(201).json({ message: "Subscribed! You'll be the first to know about new products." });
    } catch (err) {
        next(err);
    }
};

// GET /api/newsletter/unsubscribe/:token  (public — linked from emails)
export const unsubscribe = async (req, res, next) => {
    try {
        const { token } = req.params;
        const sub = await Newsletter.findOne({ unsubscribeToken: token });
        if (!sub) return res.status(404).send("Invalid unsubscribe link.");

        sub.active = false;
        await sub.save();

        // Simple HTML confirmation page
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"/><title>Unsubscribed — Jesup</title></head>
            <body style="margin:0;padding:60px 20px;font-family:sans-serif;text-align:center;background:#f4f4f5;">
              <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.06);">
                <h1 style="color:#111827;font-size:22px;margin:0 0 12px;">You've been unsubscribed</h1>
                <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px;">
                  You won't receive new product emails from Jesup Wireless anymore.<br/>
                  You can re-subscribe anytime from our store.
                </p>
                <a href="${process.env.CLIENT_URL ?? "/"}"
                   style="display:inline-block;background:#8223D2;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:100px;">
                  Back to Shop
                </a>
              </div>
            </body>
            </html>
        `);
    } catch (err) {
        next(err);
    }
};
