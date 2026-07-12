import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import RideHistory from "./pages/RideHistory";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/passenger" element={<PassengerDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/history" element={<RideHistory />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;