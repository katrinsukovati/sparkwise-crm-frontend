import "./Header.scss";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/sparkwise-logo.svg";
import { IoGrid } from "react-icons/io5";
import NavLink from "../NavLink/NavLink";
import { FaCalendar } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import { IoBriefcase } from "react-icons/io5";
import { GrPersonalComputer } from "react-icons/gr";
import { BsCreditCardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { FaBars } from "react-icons/fa6";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar automatically when switching to tablet/desktop
  useEffect(() => {
    const tabletBreakpoint = 768;

    const handleResize = () => {
      if (window.innerWidth >= tabletBreakpoint) {
        // Close the sidebar when transitioning to tablet/desktop
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button className="sidebar__toggle" onClick={toggleSidebar}>
          <FaBars className="sidebar__toggle-icon" />
        </button>
      )}

      {/* Grey backdrop */}
      <div
        className={`sidebar__backdrop ${isOpen ? "visible" : ""}`}
        onClick={toggleSidebar}
      ></div>
      {/* Sidebar */}
      <header className={`sidebar section ${isOpen ? "open" : ""}`}>
        {/* Close button for mobile */}
        <span className="sidebar__closebtn" onClick={toggleSidebar}>
          &times; {/* Close icon */}
        </span>

        <div className="sidebar__links">
          <div className="sidebar__logo">
            <Link to={"/"}>
              <img className="sidebar__img" src={logo} alt="SparkWise Logo" />
            </Link>
          </div>
          <NavLink
            icon={<IoGrid className="icon" />}
            text={"Dashboard"}
            to={"/dashboard"}
          />
          <NavLink
            icon={<FaCalendar className="icon" />}
            text={"Calendar"}
            to={"/calendar"}
          />
          <NavLink
            icon={<MdPeople className="icon" />}
            text={"Clients"}
            to={"/clients"}
          />
          {/* WIP PAGES BELOW */}
          <NavLink
            icon={<RiGraduationCapFill className="icon" />}
            text={"Students"}
            to={"/students"}
          />
          <NavLink
            icon={<IoBriefcase className="icon" />}
            text={"Teachers"}
            to={"/teachers"}
          />
          <NavLink
            icon={<GrPersonalComputer className="icon" />}
            text={"Classes"}
            to={"/classes"}
          />
          <NavLink
            icon={<BsCreditCardFill className="icon" />}
            text={"Invoices"}
            to={"/invoices"}
          />
        </div>

        {/* Bottom section with Log Out */}
        <span className="sidebar__logout">
          <NavLink
            icon={<FiLogOut className="icon" />}
            text={"Log Out"}
            to={"/logout"}
          />
        </span>
      </header>
    </>
  );
}

export default Header;
