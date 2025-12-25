import db from "../Models/index.js";
import { Op } from "sequelize";

const { Listing } = db;

export async function getBrandsFromListings(req, res) {
  try {
    const listings = await Listing.findAll({
      where: {
        status: "approved",
        isActive: true
      },
      attributes: ["brand", "model"],
      raw: true
    });

    // 🧠 группировка
    const map = {};

    for (const item of listings) {
      if (!item.brand || !item.model) continue;

      if (!map[item.brand]) {
        map[item.brand] = new Set();
      }
      map[item.brand].add(item.model);
    }

    // 🎯 преобразование в массив
    const result = Object.entries(map).map(([brand, models]) => ({
      name: brand,
      models: Array.from(models).map(m => ({ name: m }))
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка загрузки брендов" });
  }
}
