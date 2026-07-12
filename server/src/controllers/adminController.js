const User = require("../models/User");
const Driver = require("../models/Driver");
const Ride = require("../models/Ride");

// GET /api/admin/stats
const getStats = async (req, res) => {
  const totalPassengers = await User.countDocuments({ role: "passenger" });
  const totalDrivers = await User.countDocuments({ role: "driver" });
  const totalRides = await Ride.countDocuments();
  const activeRides = await Ride.countDocuments({ status: { $in: ["requested", "accepted", "ongoing"] } });
  const completedRides = await Ride.countDocuments({ status: "completed" });

  res.json({ totalPassengers, totalDrivers, totalRides, activeRides, completedRides });
};

// GET /api/admin/users?role=driver|passenger
const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : { role: { $in: ["driver", "passenger"] } };
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

// GET /api/admin/drivers  (with vehicle info)
const getAllDrivers = async (req, res) => {
  const drivers = await Driver.find().populate("user", "name email phone rating isBlocked");
  res.json(drivers);
};

// GET /api/admin/rides
const getAllRides = async (req, res) => {
  const rides = await Ride.find()
    .populate("passenger", "name phone")
    .populate("driver", "name phone")
    .sort({ createdAt: -1 });
  res.json(rides);
};

// PATCH /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user });
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await Driver.deleteOne({ user: user._id });
  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = { getStats, getAllUsers, getAllDrivers, getAllRides, toggleBlockUser, deleteUser };