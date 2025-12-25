import { DataTypes } from "sequelize";

export default function NotificationModel(sequelize) {
  const Notification = sequelize.define("Notification", {
   
  text: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Notification;
}
