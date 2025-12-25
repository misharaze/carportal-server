import db from "../Models/index.js";

const { Favorite, Listing, User } = db;

class ProfilController {

  // 🔹 GET /api/user/profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "name",
          "email",
          "role",
          "avatar",
          "phone",
          "city",
          "about"
        ]
      });

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const listings = await Listing.findAll({
        where: { userId },
        attributes: ["id", "brand", "model", "price"]
      });

      const favoritesCount = await Favorite.count({
        where: { userId }
      });

      res.json({
        user,
        stats: {
          listings: listings.length,
          favorites: favoritesCount,
          lastMonth: listings.length // пока заглушка
        },
        listings
      });

    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка профиля" });
    }
  }

  // 🔹 PUT /api/user/profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone, city, about, avatar } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      await user.update({
        name,
        phone,
        city,
        about,
        avatar
      });

      res.json({ message: "Профиль обновлён", user });

    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка обновления профиля" });
    }
  }

async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
      }
  
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
  
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
  
      await user.update({ avatar: avatarPath });
  
      res.json({
        message: "Аватар обновлён",
        avatar: avatarPath
      });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка загрузки аватара" });
    }
  }
}

export default new ProfilController();
