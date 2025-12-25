import db from "../Models/index.js";
import { Op } from "sequelize";

const { Listing } = db;

class SearchController {
  async search(req, res) {
    try {
      const q = req.query.q;
      if (!q) return res.json([]);

      const items = await Listing.findAll({
        where: {
          [Op.or]: [
            { brand: { [Op.iLike]: `%${q}%` } },
            { model: { [Op.iLike]: `%${q}%` } }
          ]
        },
        limit: 6,
        attributes: ["id", "brand", "model", "price"]
      });

      res.json(items);
    } catch (e) {
      console.error("SEARCH ERROR:", e);
      res.status(500).json([]);
    }
  }
}

export default new SearchController();
