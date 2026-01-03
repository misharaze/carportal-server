import db from "../Models/index.js";
import { Op } from "sequelize";

const { Message, Conversation, User, Listing } = db;

/* ============================
   СОЗДАТЬ СООБЩЕНИЕ / ОТКЛИК
============================ */
export async function createMessage(req, res) {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Сообщение пустое" });
    }

    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Диалог не найден" });
    }

    if (![conversation.user1Id, conversation.user2Id].includes(senderId)) {
      return res.status(403).json({ error: "Нет доступа" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      text,
      isRead: false
    });

    await conversation.update({ lastMessage: text });

    res.json(message);
  } catch (err) {
    console.error("createMessage error:", err);
    res.status(500).json({ error: "Ошибка отправки сообщения" });
  }
}



/* ============================
   СПИСОК ДИАЛОГОВ
============================ */
export async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "user2",
          attributes: ["id", "name"]
        },
        {
          model: Listing,
          attributes: ["id", "brand", "model"]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });

    const result = await Promise.all(
      conversations.map(async convo => {
        const otherUser =
          convo.user1Id === userId ? convo.user2 : convo.user1;

        const unreadCount = await Message.count({
          where: {
            conversationId: convo.id,
            isRead: false,
            senderId: { [Op.ne]: userId }
          }
        });

        return {
          id: convo.id,
          listing: convo.Listing,
          lastMessage: convo.lastMessage,
          otherUser,
          unreadCount
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ error: "Ошибка загрузки диалогов" });
  }
}

/* ============================
   СООБЩЕНИЯ В ДИАЛОГЕ
============================ */
export async function getMessages(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await Conversation.findByPk(id);

    if (!conversation) {
      return res.status(404).json({ error: "Диалог не найден" });
    }

    if (![conversation.user1Id, conversation.user2Id].includes(userId)) {
      return res.status(403).json({ error: "Нет доступа" });
    }

    const messages = await Message.findAll({
      where: { conversationId: id },
      order: [["createdAt", "ASC"]]
    });

    await Message.update(
      { isRead: true },
      {
        where: {
          conversationId: id,
          senderId: { [Op.ne]: userId }
        }
      }
    );

    res.json(
      messages.map(m => ({
        ...m.toJSON(),
        isMine: m.senderId === userId
      }))
    );
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Ошибка загрузки сообщений" });
  }
}


/* ============================
   ОТМЕТИТЬ ПРОЧИТАННЫМИ
============================ */
export async function markAsRead(req, res) {
  try {
    const userId = req.user.id;

    await Message.update(
      { isRead: true },
      {
        where: {
          conversationId: req.params.id,
          senderId: { [Op.ne]: userId }
        }
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Ошибка обновления" });
  }
}

export async function startConversation(req, res) {
  try {
    const { listingId, text } = req.body;
    const senderId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Сообщение пустое" });
    }

    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }

    const ownerId = listing.userId;

    if (ownerId === senderId) {
      return res.status(400).json({ error: "Нельзя писать самому себе" });
    }

    // 🔍 ищем существующий диалог
    let conversation = await Conversation.findOne({
      where: {
        listingId,
        [Op.or]: [
          { user1Id: senderId, user2Id: ownerId },
          { user1Id: ownerId, user2Id: senderId }
        ]
      }
    });

    // ➕ если нет — создаём
    if (!conversation) {
      conversation = await Conversation.create({
        listingId,
        user1Id: senderId,
        user2Id: ownerId,
        lastMessage: text
      });
    }

    await Message.create({
      conversationId: conversation.id,
      senderId,
      text,
      isRead: false
    });

    res.json({ conversationId: conversation.id });
  } catch (err) {
    console.error("startConversation error:", err);
    res.status(500).json({ error: "Ошибка создания диалога" });
  }
}
