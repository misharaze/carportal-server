import multer from "multer";

 storage = multer.memoryStorage();

export const uploa = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});


