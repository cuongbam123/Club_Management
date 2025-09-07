const router = require("express").Router();
const upload = require("../config/multer");

// Upload banner sự kiện
router.post("/events/banner", upload.single("banner"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // trả về link banner
  res.json({
    bannerUrl: `/api/uploads/${req.file.filename}`,
  });
});

module.exports = router;
