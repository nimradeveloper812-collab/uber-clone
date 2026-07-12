const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, vehicleNumber, vehicleModel } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, phone });

    if (role === "driver") {
      await Driver.create({ user: user._id, vehicleNumber, vehicleModel });
    }

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Your account has been blocked. Contact support." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

module.exports = { register, login, getMe };