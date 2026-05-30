import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENV.SENDER_EMAIL,
        pass: ENV.SENDER_PASS,
    },
});

// ── Base HTML wrapper ─────────────────────────────────────────────────────────
function baseTemplate(content) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

              <!-- Header -->
              <tr>
                <td style="background:#8223D2;padding:28px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">jesup wireless</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                    &copy; 2026 Jesup Wireless. All rights reserved.<br/>
                    This email was sent to you because you have an account with Jesup Shop.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
}

// ── Send helper ───────────────────────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
    try {
        await transporter.sendMail({
            from: `"Jesup Wireless" <${ENV.SENDER_EMAIL}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        // Email failure should never crash the app — just log it
        console.error("Email send failed:", err.message);
    }
}

// ── Welcome Email ─────────────────────────────────────────────────────────────
export async function sendWelcomeEmail({ to, fname }) {
    const html = baseTemplate(`
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome to Jesup, ${fname}! 🎉</h2>
        <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
            Your account has been created successfully. You can now shop our full range of devices, accessories, and more.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:28px;">
          <tr>
            <td>
              <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Account</p>
              <p style="margin:0;font-size:15px;color:#111827;font-weight:600;">${to}</p>
            </td>
          </tr>
        </table>

        <a href="${ENV.CLIENT_URL}/collections"
           style="display:inline-block;background:#8223D2;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:100px;">
          Start Shopping →
        </a>

        <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">
          Need help? Reply to this email and we'll get back to you.
        </p>
    `);

    await sendMail({ to, subject: "Welcome to Jesup Wireless! 🎉", html });
}

// ── Order Confirmation Email ──────────────────────────────────────────────────
export async function sendOrderConfirmationEmail({ to, fname, order }) {
    const itemsHTML = order.items.map((item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:14px;color:#111827;font-weight:600;">${item.name}</td>
                <td align="right" style="font-size:14px;color:#111827;font-weight:700;white-space:nowrap;">
                  $${(item.price * item.qty).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style="font-size:12px;color:#9ca3af;">
                  ${item.brand}${item.color ? ` · ${item.color}` : ""} · Qty: ${item.qty}
                </td>
                <td align="right" style="font-size:12px;color:#9ca3af;">$${item.price.toFixed(2)} each</td>
              </tr>
            </table>
          </td>
        </tr>
    `).join("");

    const html = baseTemplate(`
        <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#111827;">Order Confirmed! ✅</h2>
        <p style="margin:0 0 28px;font-size:15px;color:#6b7280;">Hi ${fname}, your order has been placed successfully.</p>

        <!-- Order Number -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ff;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
          <tr>
            <td>
              <p style="margin:0 0 2px;font-size:12px;color:#8223D2;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Order Number</p>
              <p style="margin:0;font-size:20px;color:#111827;font-weight:800;letter-spacing:1px;">${order.orderNumber}</p>
            </td>
            <td align="right">
              <span style="display:inline-block;background:#8223D2;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;">Processing</span>
            </td>
          </tr>
        </table>

        <!-- Items -->
        <p style="margin:0 0 12px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Items Ordered</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          ${itemsHTML}
        </table>

        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="font-size:13px;color:#6b7280;padding:4px 0;">Subtotal</td>
            <td align="right" style="font-size:13px;color:#111827;font-weight:600;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#6b7280;padding:4px 0;">Shipping</td>
            <td align="right" style="font-size:13px;color:#111827;font-weight:600;">${order.shipping === 0 ? "Free" : "$" + order.shipping.toFixed(2)}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr>
            <td style="font-size:13px;color:#059669;padding:4px 0;">Promo (${order.promoCode})</td>
            <td align="right" style="font-size:13px;color:#059669;font-weight:600;">-$${order.discount.toFixed(2)}</td>
          </tr>` : ""}
          <tr>
            <td style="font-size:16px;color:#111827;font-weight:700;padding-top:10px;border-top:2px solid #f3f4f6;">Total</td>
            <td align="right" style="font-size:16px;color:#111827;font-weight:800;padding-top:10px;border-top:2px solid #f3f4f6;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Shipping Address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Shipping To</p>
              <p style="margin:0;font-size:14px;color:#111827;font-weight:600;">${order.shippingAddress.name}</p>
              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
            </td>
          </tr>
        </table>

        <!-- Track Button -->
        <a href="${ENV.CLIENT_URL}/track-order/${order.orderNumber}"
           style="display:inline-block;background:#8223D2;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:100px;">
          Track Your Order →
        </a>

        <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
          We'll notify you when your order ships. Your order number is <strong>${order.orderNumber}</strong> — save it for tracking.
        </p>
    `);

    await sendMail({ to, subject: `Order Confirmed — ${order.orderNumber} | Jesup Wireless`, html });
}
