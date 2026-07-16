require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./routes/adminRoutes");



const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// req.io inject karo — sab routes se pehle
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);

const Driver = require("./models/Driver");

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("driverLocationUpdate", async (data) => {
    // data: { driverId, lat, lng }
    try {
      if (data.driverId) {
        await Driver.findOneAndUpdate(
          { user: data.driverId },
          { currentLocation: { lat: data.lat, lng: data.lng } }
        );
      }
    } catch (err) {
      console.error("Location update failed:", err.message);
    }
    // sab clients ko bhejo (driverId ke sath, taake passenger map update kar sake)
    io.emit("driverLocation", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));