const express = require("express");
const {
  getStats,
  getAllUsers,
  getAllDrivers,
  getAllRides,
  toggleBlockUser,
  deleteUser,
} = require("../controllers/adminController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.use(protect, requireRole("admin")); // sab admin routes protected

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/drivers", getAllDrivers);
router.get("/rides", getAllRides);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

module.exports = router;