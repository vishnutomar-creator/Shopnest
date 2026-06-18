const express = require('express');
const { protect } = require("../middleware/AuthMiddleware");
const  { admin } = require("../middleware/AdminMiddleware");
const { getAdminStats } = require("../controllers/AnalyticsController");

const router = express.Router();

router.get("/", protect, admin, getAdminStats);

module.exports = router;