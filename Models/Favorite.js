import { DataTypes } from "sequelize";

export default function FavoriteModel(sequelize) {
  const Favorite = sequelize.define("Favorite", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Favorite;
}
