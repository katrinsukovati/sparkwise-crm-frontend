import "./NavLink.scss";
import { Link, useLocation } from "react-router-dom";

function NavLink({ icon, text, to }) {
  // This gets the current url
  const location = useLocation();
  return (
    <span
      className={
        location.pathname.includes(to)
          ? "container container--active"
          : "container"
      }
    >
      {icon}
      <Link
        className={
          location.pathname.includes(to)
            ? "container__link container__link--active"
            : "container__link"
        }
        to={to}
      >
        {text}
      </Link>
    </span>
  );
}

export default NavLink;
