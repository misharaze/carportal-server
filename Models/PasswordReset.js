import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PasswordReset = sequelize.define("PasswordReset", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return PasswordReset;
};
