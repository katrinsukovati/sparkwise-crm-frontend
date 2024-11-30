import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import the pages
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ClientsPage from "./pages/ClientsPage/ClientsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.jsx";
import ClassesPage from "./pages/ClassesPage/ClassesPage.jsx";
import "./styles/partials/_globals.scss";

import { useState } from "react";
import LoginPage from "././pages/LoginPage/LoginPage.jsx";

// Import components
import Header from "./components/Header/Header.jsx";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <>
      <ToastContainer theme="colored" />
      {!accessToken ? (
        <LoginPage onLoginSuccess={(token) => setAccessToken(token)} />
      ) : (
        <div className="app">
          <BrowserRouter>
            <Header />
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Navigate to="/calendar" replace />} />
              <Route
                path="/calendar"
                element={<CalendarPage accessToken={accessToken} />}
              />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
