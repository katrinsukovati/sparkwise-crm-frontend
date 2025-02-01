import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import the pages
import ClientsPage from "./pages/ClientsPage/ClientsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.jsx";
import SemestersPage from "./pages/SemestersPage/SemestersPage.jsx";
import StudentsPage from "./pages/StudentsPage/StudentsPage.jsx";
import TeachersPage from "./pages/TeachersPage/TeachersPage.jsx";
import ClassesPage from "./pages/ClassesPage/ClassesPage.jsx";
import AddClassPage from "./pages/AddClassPage/AddClassPage.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage/ClassDetailsPage.jsx";
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
      {/* {!accessToken ? (
        <LoginPage onLoginSuccess={(token) => setAccessToken(token)} />
      ) : ( */}
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
            <Route path="/semesters" element={<SemestersPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route
              path="/semesters/:semesterId/classes"
              element={<ClassesPage />}
            />
            <Route
              path="/semesters/:semesterId/classes/add"
              element={<AddClassPage />}
            />

            <Route
              path="/semesters/:semesterId/classes/:classId"
              element={<ClassDetailsPage />}
            />
          </Routes>
        </BrowserRouter>
      </div>
      {/* )} */}
    </>
  );
}

export default App;
