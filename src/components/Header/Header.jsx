import "./Header.scss";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/sparkwise-logo.svg";
import NavLink from "../NavLink/NavLink";
import { FaCalendar } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import { IoBriefcase } from "react-icons/io5";
import { GrPersonalComputer } from "react-icons/gr";
import { BsCreditCardFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar automatically when switching to tablet/desktop
  useEffect(() => {
    const tabletBreakpoint = 768;

    const handleResize = () => {
      if (window.innerWidth >= tabletBreakpoint) {
        // Close the sidebar when transitioning to tablet/desktop
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <button className="sidebar__toggle" onClick={toggleSidebar}>
          <FaBars className="sidebar__toggle-icon" />
        </button>
      )}

      {/* Grey backdrop */}
      <div
        className={`sidebar__backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className="app">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* Close button for mobile */}
          <span className="sidebar__closebtn" onClick={toggleSidebar}>
            &times; {/* Close icon */}
          </span>
          <ul className="sidebar__ul">
            <Link to={"/"}>
              <img className="sidebar__logo" src={logo} alt="SparkWise Logo" />
            </Link>
            <li className="sidebar__item">
              <NavLink
                icon={<FaCalendar className="icon" />}
                text={"Calendar"}
                to={"/calendar"}
              />
            </li>
            <li className="sidebar__item">
              <NavLink
                icon={<MdPeople className="icon" />}
                text={"Clients"}
                to={"/clients"}
              />
            </li>
            <li className="sidebar__item">
              <NavLink
                icon={<RiGraduationCapFill className="icon" />}
                text={"Students"}
                to={"/students"}
              />
            </li>
            <li className="sidebar__item">
              <NavLink
                icon={<IoBriefcase className="icon" />}
                text={"Teachers"}
                to={"/teachers"}
              />
            </li>
            <li className="sidebar__item">
              <NavLink
                icon={<GrPersonalComputer className="icon" />}
                text={"Semesters"}
                to={"/semesters"}
              />
            </li>
            <li className="sidebar__item">
              <NavLink
                icon={<BsCreditCardFill className="icon" />}
                text={"Invoices"}
                to={"/invoices"}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
