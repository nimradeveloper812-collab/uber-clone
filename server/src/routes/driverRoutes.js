const express = require("express");
const { getAvailableDrivers } = require("../controllers/driverController");
const { protect } = require("../middlewares/auth");

const router = express.Router();
router.get("/available", protect, getAvailableDrivers);

module.exports = router;