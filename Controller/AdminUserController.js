import db from "../Models/index.js";
const { User } = db;

/* ===== GET USERS ===== */
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isBanned", "createdAt"],
      order: [["id", "DESC"]]
    });

    res.json({
      items: users,
      total: users.length
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка загрузки пользователей" });
  }
};

/* ===== UPDATE ROLE ===== */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.role = role;
    await user.save();

    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка обновления роли" });
  }
};

/* ===== BAN / UNBAN ===== */
export const toggleBan = async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.isBanned = isBanned;
    await user.save();

    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка блокировки" });
  }
};

/* ===== DELETE USER ===== */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    await user.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка удаления пользователя" });
  }
};
