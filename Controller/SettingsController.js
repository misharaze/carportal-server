import db from "../Models/index.js";
const { Settings } = db;

// получить настройки
export async function getSettings(req, res) {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  res.json(settings);
}

// обновить настройки
export async function updateSettings(req, res) {
  const data = req.body;

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(data);
  } else {
    await settings.update(data);
  }

  res.json(settings);
}
