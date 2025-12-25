import db from "../Models/index.js";

const { Notification } = db;

/* ======================================
   ✅ СОЗДАТЬ УВЕДОМЛЕНИЕ (внутренний вызов)
====================================== */
export async function createNotification(userId, text) {
  try {
    return await Notification.create({
      userId,
      text,
      isRead: false
    });
  } catch (e) {
    console.error("Ошибка создания уведомления:", e);
  }
}

/* ======================================
   ✅ ПОЛУЧИТЬ ВСЕ УВЕДОМЛЕНИЯ ПОЛЬЗОВАТЕЛЯ
====================================== */
export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка загрузки уведомлений" });
  }
}

/* ======================================
   ✅ КОЛИЧЕСТВО НЕПРОЧИТАННЫХ
====================================== */
export async function getUnreadCount(req, res) {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({ count });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка подсчета" });
  }
}

/* ======================================
   ✅ ОТМЕТИТЬ КАК ПРОЧИТАННОЕ
====================================== */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    await Notification.update(
      { isRead: true },
      { where: { id, userId: req.user.id } }
    );

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка обновления" });
  }
}

/* ======================================
   ✅ ОЧИСТИТЬ ВСЕ УВЕДОМЛЕНИЯ
====================================== */
export async function clearNotifications(req, res) {
  try {
    await Notification.destroy({
      where: { userId: req.user.id }
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка очистки" });
  }
}
