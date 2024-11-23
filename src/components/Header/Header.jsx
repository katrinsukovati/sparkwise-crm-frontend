import "./Header.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo/sparkwise-logo.svg";

function Header() {
  // This gets the current url
  const location = useLocation();
  return (
    <header className="header section">
      <div className="layout header-container">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="SparkWise Logo" />
        </Link>
        {/* Container for nav links */}
        <nav className="header-nav-links">
          {/* Dashboard navigation */}
          <Link to="/">Dashboard</Link>
          {/* Calendar navigation */}
          <Link to="/calendar">Calendar</Link>
          {/* Clients navigation */}
          <Link to="/clients">Clients</Link>
          {/* WIP PAGES BELOW */}
          {/* Students navigation */}
          <Link to="/students">Students</Link>
          {/* Teachers navigation */}
          <Link to="/teachers">Teachers</Link>
          {/* Classes navigation */}
          <Link to="/slasses">Classes</Link>
          {/* Invoices navigation */}
          <Link to="/invoices">Invoices</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
