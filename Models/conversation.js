import { DataTypes } from "sequelize";


export default function ConversationModel(sequelize) {
 const Conversation = sequelize.define("Conversation", {
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userAId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userBId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastMessage: DataTypes.TEXT
  });
  return Conversation
}
