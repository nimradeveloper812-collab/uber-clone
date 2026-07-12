require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Driver = require("./models/Driver");

const drivers = [
  { name: "Ali Raza", email: "ali.driver@test.com", phone: "03001234567", vehicleNumber: "LEA-1234", vehicleModel: "Suzuki Alto", lat: 31.5204, lng: 74.3587 },
  { name: "Bilal Khan", email: "bilal.driver@test.com", phone: "03011234567", vehicleNumber: "LEB-5678", vehicleModel: "Honda City", lat: 31.5100, lng: 74.3450 },
  { name: "Usman Tariq", email: "usman.driver@test.com", phone: "03021234567", vehicleNumber: "LEC-9012", vehicleModel: "Toyota Corolla", lat: 31.4805, lng: 74.3573 },
  { name: "Hamza Sheikh", email: "hamza.driver@test.com", phone: "03031234567", vehicleNumber: "LED-3456", vehicleModel: "Suzuki Cultus", lat: 31.4697, lng: 74.2728 },
  { name: "Fahad Malik", email: "fahad.driver@test.com", phone: "03041234567", vehicleNumber: "LEE-7890", vehicleModel: "Honda Civic", lat: 31.5656, lng: 74.3141 },
];

const passengers = [
  { name: "Ayesha Noor", email: "ayesha.pass@test.com", phone: "03051234567" },
  { name: "Zainab Malik", email: "zainab.pass@test.com", phone: "03061234567" },
  { name: "Nimra Developer", email: "nimra.pass@test.com", phone: "03071234567" },
];

const admin = { name: "Admin", email: "admin@rideapp.com", phone: "03000000000" };

const PASSWORD = "test1234";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB, seeding...");

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // Admin
  await User.findOneAndUpdate(
    { email: admin.email },
    { ...admin, password: hashedPassword, role: "admin" },
    { upsert: true, new: true }
  );

  // Passengers
  for (const p of passengers) {
    await User.findOneAndUpdate(
      { email: p.email },
      { ...p, password: hashedPassword, role: "passenger" },
      { upsert: true, new: true }
    );
  }

  // Drivers
  for (const d of drivers) {
    const user = await User.findOneAndUpdate(
      { email: d.email },
      { name: d.name, email: d.email, phone: d.phone, password: hashedPassword, role: "driver" },
      { upsert: true, new: true }
    );

    await Driver.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        vehicleNumber: d.vehicleNumber,
        vehicleModel: d.vehicleModel,
        isAvailable: true,
        currentLocation: { lat: d.lat, lng: d.lng },
      },
      { upsert: true, new: true }
    );
  }

  console.log("Seeding complete!");
  console.log("All accounts password:", PASSWORD);
  console.log("Admin login: admin@rideapp.com");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});