const express = require("express");
const {
  requestRide,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  getPendingRides,
} = require("../controllers/rideController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/request", protect, requireRole("passenger"), requestRide);
router.get("/pending", protect, requireRole("driver"), getPendingRides);
router.patch("/:id/accept", protect, requireRole("driver"), acceptRide);
router.patch("/:id/status", protect, updateRideStatus);
router.get("/history", protect, getRideHistory);

module.exports = router;