const Driver = require("../models/Driver");

// GET /api/drivers/available
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true }).populate(
      "user",
      "name phone rating"
    );
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAvailableDrivers };