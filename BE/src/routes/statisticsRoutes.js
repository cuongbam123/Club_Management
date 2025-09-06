const router = require("express").Router();
const { getOverview } = require("../controllers/statisticsController");
const { verifyToken } = require("../middlewares/auth");

router.get("/overview", verifyToken, getOverview);

module.exports = router;
