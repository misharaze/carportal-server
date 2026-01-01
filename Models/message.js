import { DataTypes } from "sequelize";

export default function MessageModel (sequelize) {
  const Message = sequelize.define("Message", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Message;
};
