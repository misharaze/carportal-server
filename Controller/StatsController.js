// Server/Controller/adminStatsController.js
import db from "../Models/index.js";
import { fn, col } from "sequelize";

const { User, Listing } = db;


export async function getAdminStats(req, res) {
  try {
    const totalUsers = await User.count();
    const totalListings = await Listing.count();
    const activeListings = await Listing.count({ where: { status: "approved" } });
    const pendingListings = await Listing.count({ where: { status: "pending" } });

    const topBrands = await Listing.findAll({
      attributes: [
        "brand",
        [db.sequelize.fn("COUNT", db.sequelize.col("brand")), "count"]
      ],
      group: ["brand"],
      order: [[db.sequelize.literal("count"), "DESC"]],
      limit: 5
    });

    res.json({
      totalUsers,
      totalListings,
      activeListings,
      pendingListings,
      topBrands
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка получения статистики" });
  }
}