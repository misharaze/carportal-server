import crypto from "crypto";
import bcrypt from "bcrypt";
import db from "../Models/index.js";
import { sendMail } from "../service/mailService.js";

const { User, PasswordReset } = db;

class PasswordController {

  // =========================
  // FORGOT PASSWORD
  // =========================
  async forgot(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    // ❗ Никогда не раскрываем, существует ли email
    if (!user) {
      return res.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await PasswordReset.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30) // 30 минут на изменения срок действия 
    });

    const link = `http://localhost:3000/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Восстановление пароля",
      html: `
        <h2>Восстановление пароля</h2>
        <p>Нажмите кнопку ниже:</p>
        <a href="${link}" style="
          display:inline-block;
          padding:12px 20px;
          background:#5b7cfa;
          color:white;
          border-radius:8px;
          text-decoration:none;
          font-weight:600;
        ">Сбросить пароль</a>
        <p style="margin-top:16px;color:#777">
          Ссылка действительна 30 минут
        </p>
      `
    });

    res.json({ ok: true });
  }

  // =========================
  // RESET PASSWORD
  // =========================
  async reset(req, res) {
    const { token, password } = req.body;

    const record = await PasswordReset.findOne({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Токен недействителен" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.update(
      { password: hash },
      { where: { id: record.userId } }
    );

    await record.destroy();

    res.json({ ok: true });
  }
}

export default new PasswordController();
