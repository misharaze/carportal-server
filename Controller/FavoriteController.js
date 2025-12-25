import db from "../Models/index.js";
const { Favorite, Listing } = db;

export async function toggleFavorite(req, res) {
  const userId = req.user.id;
  const { listingId } = req.params;

  const exist = await Favorite.findOne({
    where: { userId, listingId }
  });

  if (exist) {
    await exist.destroy();
    return res.json({ message: "Удалено из избранного" });
  }

  await Favorite.create({ userId, listingId });
  res.json({ message: "Добавлено в избранное" });
}

export async function getFavorites(req, res) {
  const favorites = await Favorite.findAll({
    where: { userId: req.user.id },
    include: Listing
  });

  res.json(favorites);
}
