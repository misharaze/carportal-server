import { checkVin } from "../service/vinService.js";

export async function checkVinController(req, res) {
  try {
    const data = await checkVin(req.params.vin);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Ошибка VIN проверки" });
  }
}
