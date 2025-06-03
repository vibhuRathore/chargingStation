import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.jsx";
import Chargers from "./components/chargingStation.jsx";
import Navbar from "./components/navbar.jsx";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/chargers"
          element={
            <PrivateRoute>
              <Chargers />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;