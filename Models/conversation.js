// models/Conversation.js
import { DataTypes } from "sequelize";

export default function ConversationModel(sequelize) {
  return sequelize.define("Conversation", {
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastMessage: DataTypes.TEXT
  });
}
