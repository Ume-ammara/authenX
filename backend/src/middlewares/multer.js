import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only jpeg, jpg, and png images are allowed!"), false);
//   }
// };

export const upload = multer({
  storage: storage,
  // fileFilter,
  limits: {
    fieldSize: 1 * 1000 * 1000,
  },
});
