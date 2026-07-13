import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Passengers from "./pages/Passengers";
import Rides from "./pages/Rides";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
          <Route path="/passengers" element={<ProtectedRoute><Passengers /></ProtectedRoute>} />
          <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
          <Route path="/" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;