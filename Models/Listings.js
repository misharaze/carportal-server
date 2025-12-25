// Server/Models/Listings.js
import { DataTypes } from "sequelize";

export default function ListingModel(sequelize) {
  const Listing = sequelize.define("Listing", {
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    mileage: { type: DataTypes.INTEGER, allowNull: false },
    engineVolume: { type: DataTypes.STRING },
    power: { type: DataTypes.STRING },
    fuelType: { type: DataTypes.STRING },
    gearbox: { type: DataTypes.STRING },
    drive: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    condition: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },

    // 🔥 новое
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending" // pending | approved | rejected
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }, 
    vin: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    
  });

  return Listing;
}
