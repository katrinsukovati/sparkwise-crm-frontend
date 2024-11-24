import "./Header.scss";
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

function Header() {
  // This gets the current url
  const location = useLocation();
  return (
    <header className="sidebar section">
      <div className="sidebar__links">
        <div className="sidebar__logo">
          <img className="sidebar__img" src={logo} alt="SparkWise Logo" />
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
  );
}

export default Header;
