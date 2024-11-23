import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import the pages
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ClientsPage from "./pages/ClientsPage/ClientsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.jsx";

// Import components
import Header from "./components/Header/Header.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
