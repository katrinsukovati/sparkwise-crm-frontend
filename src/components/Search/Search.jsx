import "./Search.scss";
import { IoIosSearch } from "react-icons/io";

function Search() {
  return (
    <div className="search-bar">
      <IoIosSearch className="search-icon" />
      <input type="text" className="search-input" placeholder="Search..." />
    </div>
  );
}

export default Search;
