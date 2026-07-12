const Ride = require("../models/Ride");

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const requestRide = async (req, res) => {
  try {
    const { pickup, drop } = req.body;
    const distanceKm = getDistanceKm(pickup.lat, pickup.lng, drop.lat, drop.lng);
    const fare = Math.round(50 + distanceKm * 15);

    const ride = await Ride.create({
      passenger: req.user.id,
      pickup,
      drop,
      distanceKm: Number(distanceKm.toFixed(2)),
      fare,
      status: "requested",
    });

    req.io.emit("newRideRequest", ride);
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested")
      return res.status(400).json({ message: "Ride already taken" });

    ride.driver = req.user.id;
    ride.status = "accepted";
    await ride.save();

    req.io.emit("rideAccepted", ride);
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = status;
    await ride.save();

    req.io.emit("rideStatusUpdate", ride);
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const filter =
      req.user.role === "driver" ? { driver: req.user.id } : { passenger: req.user.id };
    const rides = await Ride.find(filter).sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { requestRide, acceptRide, updateRideStatus, getRideHistory };