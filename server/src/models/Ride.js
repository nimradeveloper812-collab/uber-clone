const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickup: { lat: Number, lng: Number, address: String },
  drop: { lat: Number, lng: Number, address: String },
  distanceKm: Number,
  fare: Number,
  status: {
    type: String,
    enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
    default: "requested",
  },
  rating: Number,
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);