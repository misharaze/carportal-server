import sequelize from "../Config/Database.js";

import UserModel from "./user.js";
import SettingsModel from "./Settings.js";
import ListingModel from "./Listings.js";
import FavoriteModel from "./Favorite.js";
import NotificationModel from "./Notification.js";
import PasswordResetModel from "./PasswordReset.js";

const User = UserModel(sequelize);
const Listing = ListingModel(sequelize);
const Favorite = FavoriteModel(sequelize);
const Notification = NotificationModel(sequelize);
const PasswordReset = PasswordResetModel(sequelize);
const Settings = SettingsModel(sequelize);
/* ===== ASSOCIATIONS ===== */

// User → Listings
User.hasMany(Listing, { foreignKey: "userId" });
Listing.belongsTo(User, { foreignKey: "userId" });

// Favorites
User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

Listing.hasMany(Favorite, { foreignKey: "listingId" });
Favorite.belongsTo(Listing, { foreignKey: "listingId" });

// Notifications
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(PasswordReset, { foreignKey: "userId" });
PasswordReset.belongsTo(User, { foreignKey: "userId" });




const db = {
  sequelize,
  User,
  Listing,
  Favorite,
  Notification,
  PasswordReset
 
};

export default db;
