import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + ext);
  }
});

const fileFilter = (_, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Только изображения"), false);
  } else {
    cb(null, true);
  }
};

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});
