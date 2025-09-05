const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // thư mục lưu file
  },
  filename: (req, file, cb) => {
    // Đặt tên: thời gian + random + đuôi gốc (.png, .jpg...)
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
