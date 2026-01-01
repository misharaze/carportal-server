import sequelize from "../Config/Database.js";

import UserModel from "./user.js";
import SettingsModel from "./Settings.js";
import ListingModel from "./Listings.js";
import FavoriteModel from "./Favorite.js";
import NotificationModel from "./Notification.js";
import PasswordResetModel from "./PasswordReset.js";
import ConversationModel from "./conversation.js";
import MessageModel from "./message.js";

/* MODELS */
const User = UserModel(sequelize);
const Listing = ListingModel(sequelize);
const Favorite = FavoriteModel(sequelize);
const Notification = NotificationModel(sequelize);
const PasswordReset = PasswordResetModel(sequelize);
const Settings = SettingsModel(sequelize);
const Conversation = ConversationModel(sequelize);
const Message = MessageModel(sequelize);

/* =======================
   ASSOCIATIONS
======================= */
// ===== USERS & LISTINGS =====
User.hasMany(Listing, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
Listing.belongsTo(User, {
  foreignKey: "userId"
});

// ===== FAVORITES =====
User.hasMany(Favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
Favorite.belongsTo(User, { foreignKey: "userId" });

Listing.hasMany(Favorite, {
  foreignKey: "listingId",
  onDelete: "CASCADE"
});
Favorite.belongsTo(Listing, { foreignKey: "listingId" });

// ===== NOTIFICATIONS =====
User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
Notification.belongsTo(User, { foreignKey: "userId" });

// ===== PASSWORD RESET =====
User.hasMany(PasswordReset, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
PasswordReset.belongsTo(User, { foreignKey: "userId" });

// ===== CONVERSATIONS =====
User.hasMany(Conversation, {
  foreignKey: "userAId",
  as: "conversationsAsA",
  onDelete: "CASCADE"
});

User.hasMany(Conversation, {
  foreignKey: "userBId",
  as: "conversationsAsB",
  onDelete: "CASCADE"
});

Conversation.belongsTo(User, {
  as: "userA",
  foreignKey: "userAId"
});

Conversation.belongsTo(User, {
  as: "userB",
  foreignKey: "userBId"
});

// ===== LISTING ↔ CONVERSATION =====
Listing.hasMany(Conversation, {
  foreignKey: "listingId",
  onDelete: "CASCADE"
});

Conversation.belongsTo(Listing, {
  foreignKey: "listingId"
});

// ===== MESSAGES =====
Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  onDelete: "CASCADE"
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId"
});

User.hasMany(Message, {
  foreignKey: "senderId",
  onDelete: "CASCADE"
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender"
});

/* EXPORT */
const db = {
  sequelize,
  User,
  Listing,
  Favorite,
  Notification,
  PasswordReset,
  Settings,
  Conversation,
  Message
};

export default db;
