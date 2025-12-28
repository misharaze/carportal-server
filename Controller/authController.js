import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../Models/index.js";
import { Op } from "sequelize";

const { User, Listing, Favorite } = db;

/* ==========================
   ✅ РЕГИСТРАЦИЯ
========================== */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Заполните все поля" });
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.status(400).json({ error: "Пользователь уже существует" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "user",     // 🔐 всегда user
      isBanned: false  // ✅ чтобы не падало
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка регистрации" });
  }
}

/* ==========================
   ✅ ЛОГИН
========================== */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Неверные данные" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Неверные данные" });
  }

  // 🔐 ЕСЛИ ВКЛЮЧЁН 2FA
  if (user.twoFactorEnabled) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.twoFactorCode = code;
    user.twoFactorExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Код подтверждения входа",
      html: `
        <h2>Код подтверждения</h2>
        <p><b>${code}</b></p>
        <p>Действителен 5 минут</p>
      `
    });

    return res.json({
      twoFactor: true,
      userId: user.id
    });
  }

  // обычный логин без 2FA
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
}

/* ==========================
   ✅ ПРОФИЛЬ + АНАЛИТИКА
========================== */
export async function getProfileStats(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"]
    });

    const listingsCount = await Listing.count({ where: { userId } });

    const favoritesCount = Favorite
      ? await Favorite.count({ where: { userId } })
      : 0;

    const listings = await Listing.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    const lastMonthCount = await Listing.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      user,
      stats: {
        listings: listingsCount,
        favorites: favoritesCount,
        lastMonth: lastMonthCount
      },
      listings
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка профиля" });
  }
}


/* ==========================
   ✅ СМЕНА ПАРОЛЯ
========================== */
export async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Старый пароль неверный" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hash },
      { where: { id: userId } }
    );

    res.json({ message: "Пароль обновлён" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка смены пароля" });
  }
}


export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {

      attributes: ["id",
         "name",
         "email",
         "role",
         "phone", 
         "city", 
         "about", 
         "createdAt"
        ]
    });

    const listings = await Listing.findAll({
      where: { userId: req.user.id }
    });

    const favorites = await Favorite.count({
      where: { userId: req.user.id }
    });

    res.json({
      user,
      stats: {
        listings: listings.length,
        favorites,
        lastMonth: listings.filter(i => {
          const date = new Date(i.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date > monthAgo;
        }).length
      },
      listings
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка профиля" });
  }
}

/* ✅ ОБНОВИТЬ ПРОФИЛЬ */
export async function updateProfile(req, res) {
  try {
    const { name, phone, city, about } = req.body;

    await User.update(
      { name, phone, city, about },
      { where: { id: req.user.id } }
    );

    const updated = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "city", "about"]
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка обновления профиля" });
  }
}
export async function verify2FA(req, res) {
  const { userId, code } = req.body;

  const user = await User.findByPk(userId);

  if (
    user.twoFactorCode !== code ||
    user.twoFactorExpires < new Date()
  ) {
    return res.status(400).json({ error: "Неверный код" });
  }

  user.twoFactorCode = null;
  user.twoFactorExpires = null;
  await user.save();

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
}
const settings = await Settings.findOne();

if (!settings.allowRegistration) {
  return res.status(403).json({
    error: "Регистрация временно отключена администратором"
  });
}