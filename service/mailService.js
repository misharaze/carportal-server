import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim()
      }
    });

    console.log("📨 TRY SEND TO:", to);

    const info = await transporter.sendMail({
      from: `"CarPortal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ SMTP SENT:", info.messageId);
    return true;

  } catch (err) {
    console.error("❌ SMTP SEND ERROR:", err);
    return false;
  }
};
