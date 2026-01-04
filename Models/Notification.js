// models/Notification.js
import { DataTypes } from "sequelize";

export default function NotificationModel(sequelize) {
  return sequelize.define("Notification", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"system"
      // "message" | "listing" | "system"
    },

    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true
      // conversationId или listingId
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
}
