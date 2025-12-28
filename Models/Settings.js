import { DataTypes } from "sequelize";


export default (sequelize) => {
  const Settings = sequelize.define("Settings", {
    maintenance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowRegistration: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    logLevel: {
      type: DataTypes.STRING,
      defaultValue: "info"
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: "dark"
    }
  });

  return Settings;
};
