import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import the pages
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ClientsPage from "./pages/ClientsPage/ClientsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.jsx";
import "./styles/partials/_globals.scss";

import { useState } from "react";
import LoginPage from "././pages/LoginPage/LoginPage.jsx";

// Import components
import Header from "./components/Header/Header.jsx";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <>
      {!accessToken ? (
        <LoginPage onLoginSuccess={(token) => setAccessToken(token)} />
      ) : (
        <div className="app">
          <BrowserRouter>
            <Header />
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route
                path="/calendar"
                element={<CalendarPage accessToken={accessToken} />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
