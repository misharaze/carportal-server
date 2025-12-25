import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },

    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

     phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

   city: {
      type: DataTypes.STRING,
      allowNull: true
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
    
  });

  return User;
};
