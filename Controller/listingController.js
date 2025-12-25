import db from "../Models/index.js";
import cloudinary from "../Config/cloudinary.js"; 
import { Op } from "sequelize";
import { createNotification } from "./NotificationController.js";
const { Listing, User } = db;

// ✅ CREATE
export async function createListing(req, res) {
  try {
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === "") {
        req.body[key] = null;     // ← PostgreSQL принимает null, но не ""
      }
    });




    const {
      brand, model, year, price, mileage,
      engineVolume, power, fuelType,
      gearbox, drive, color,
      condition, description, vin
    } = req.body;

    let imageUrl = null;

    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataURI, { folder: "car-portal" });
      imageUrl = result.secure_url;
    }

    const listing = await Listing.create({
      brand,
      model,
      year,
      price,
      mileage,
      engineVolume,
      power,
      fuelType,
      gearbox,
      drive,
      color,
      condition,
      description,
      vin,
      image: imageUrl,
      userId: req.user.id
    });


    await createNotification(
      req.user.id,
      `Ваше объявление ${brand} ${model} создано и отправлено на модерацию`
    );

    res.json(listing);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка создания объявления" });
  }
}

// ✅ GET
export async function getListings(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      model,
      condition,
      minPrice,
      maxPrice,
      minMileage,
      maxMileage
    } = req.query;

    const where = {};

    if (brand && brand.trim() !== "") {
      where.brand = { [Op.iLike]: `%${brand}%` };
    }

    if (model && model.trim() !== "") {
      where.model = { [Op.iLike]: `%${model}%` };
    }

    if (condition && condition.trim() !== "") {
      where.condition = condition;
    }

    const priceMin = Number(minPrice);
    const priceMax = Number(maxPrice);
    
    if (!Number.isNaN(priceMin) || !Number.isNaN(priceMax)) {
      where.price = {};
    
      if (!Number.isNaN(priceMin)) {
        where.price[Op.gte] = priceMin;
      }
    
      if (!Number.isNaN(priceMax)) {
        where.price[Op.lte] = priceMax;
      }
    }
    

     // 🚗 MILEAGE
    const mileageMin = Number(minMileage);
    const mileageMax = Number(maxMileage);
    


    if (!Number.isNaN(mileageMin) || !Number.isNaN(mileageMax)) {
      where.mileage = {};
    
      if (!Number.isNaN(mileageMin)) {
        where.mileage[Op.gte] = mileageMin;
      }
    
      if (!Number.isNaN(mileageMax)) {
        where.mileage[Op.lte] = mileageMax;
      }
    }
    
    const offset = (page - 1) * limit;

    const { rows, count } = await Listing.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
      
    });

    res.json({
      items: rows,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка получения списка" });
  }
}

// ✅ DELETE
export async function deleteListing(req, res) {
  try {
    await Listing.destroy({ where: { id: req.params.id } });
    res.json({ message: "Удалено" });
  } catch (e) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
}

/* ========= АДМИН-ЧАСТЬ ========= */

// 1) Получить ВСЕ объявления (любой статус)
export async function adminGetListings(req, res) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Listing.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset: +offset,
      include: [{ model: User, attributes: ["id", "name", "email"] }]
    });

    res.json({
      items: rows,
      total: count,
      page: +page,
      pages: Math.ceil(count / limit)
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка adminGetListings" });
  }
}

// 2) Изменить статус объявления
export async function adminUpdateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Некорректный статус" });
    }

    await Listing.update(
      {
        status,
        isActive: status === "approved"
      },
      { where: { id } }
    );

    // 🔥 НАСТОЯЩЕЕ объявление
    const updated = await Listing.findByPk(id);

    let text = "";

    if (status === "approved") {
      text = `Ваше объявление "${updated.brand} ${updated.model}" одобрено!`;
    }

    if (status === "rejected") {
      text = `Ваше объявление "${updated.brand} ${updated.model}" отклонено администратором.`;
    }

    // 🔥 Отправляем уведомление владельцу
    await createNotification(updated.userId, text);

    res.json(updated);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка изменения статуса" });
  }
}


// 3) Редактирование объявления (частичное)
export async function adminUpdateListing(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;  // brand, model, price и т.д.

    await Listing.update(data, { where: { id } });
    const updated = await Listing.findByPk(id);

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка редактирования объявления" });
  }
}
export async function createByAdmin(req, res) {
  try {
    const {
      brand,
      model,
      price,
      mileage,
      image,
      userID,
     } = req.body;

     if (!brand || !model || !price) {
      return res.status(400).json({ error: "Заполните обязательные поля" });
    }
    const listing = await Listing.create({
      brand,
      model,
      price,
      mileage,
      image,
      userId: userID || req.user.id, // 👑 админ ИЛИ выбранный юзер
      status: "approved", 
      isActive: true,
    });

    res.json(listing);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка создания админом" });
  }
}
export async function getOneListing(req, res) {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name"] }]
    });

    if (!listing) {
      return res.status(404).json({ error: "Не найдено" });
    }

    res.json(listing);
  } catch (e) {
    res.status(500).json({ error: "Ошибка загрузки" });
  }
}
// ✅ МАССОВОЕ СОЗДАНИЕ ОБЪЯВЛЕНИЙ (АДМИН)
export async function bulkCreateListings(req, res) {
  try {
    const { listings } = req.body; // массив объявлений

    if (!Array.isArray(listings) || listings.length === 0) {
      return res.status(400).json({ error: "Передай массив объявлений" });
    }

    const prepared = listings.map(item => ({
      ...item,
      userId: req.user.id,   // ✅ админ как владелец
      status: "approved",   // ✅ сразу одобрены
      isActive: true
    }));

    const result = await Listing.bulkCreate(prepared);

    res.json({
      message: `✅ Загружено ${result.length} объявлений`,
      items: result
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка массовой загрузки" });
  }
}

