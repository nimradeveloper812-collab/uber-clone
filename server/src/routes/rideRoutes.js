const express = require("express");
const {
  requestRide,
  acceptRide,
  updateRideStatus,
  getRideHistory,
} = require("../controllers/rideController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/request", protect, requireRole("passenger"), requestRide);
router.patch("/:id/accept", protect, requireRole("driver"), acceptRide);
router.patch("/:id/status", protect, updateRideStatus);
router.get("/history", protect, getRideHistory);

module.exports = router;