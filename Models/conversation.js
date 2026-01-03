import { DataTypes } from "sequelize";

export default function ConversationModel(sequelize) {
  const Conversation = sequelize.define("Conversation", {
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "listingId"
    },

    // в коде будет conversation.userAId,
    // но в БД это колонка user1Id
    userAId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user1Id"
    },

    // в коде будет conversation.userBId,
    // но в БД это колонка user2Id
    userBId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user2Id"
    },

    lastMessage: {
      type: DataTypes.TEXT,
      field: "lastMessage"
    }
  });

  return Conversation;
}
