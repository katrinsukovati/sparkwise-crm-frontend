import "../ClassesPage/ClassesPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassesListHeader from "../../components/ClassesListHeader/ClassesListHeader";
import ClassesList from "../../components/ClassesList/ClassesList";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { IoArrowBack } from "react-icons/io5";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClassesPage() {
  const { semesterId } = useParams(); // Get semester ID from URL
  const navigate = useNavigate(); // Initialize navigate function
  const [semesterName, setSemesterName] = useState("");
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Fetch Semester Name
  useEffect(() => {
    axios
      .get(`${URL}/semesters/${semesterId}`)
      .then((res) => setSemesterName(res.data.name))
      .catch((err) => console.error("Error fetching semester:", err));
  }, [semesterId]);

  // Fetch all classes for the given semester
  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${URL}/semesters/${semesterId}/classes`,
        {
          params: {
            search: searchQuery,
            sortBy: sortOption,
          },
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [semesterId, searchQuery, sortOption]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <Breadcrumbs />
      {/* Back Arrow to Navigate to Semester Page */}
      <div className="back-navigation">
        <IoArrowBack
          className="back-arrow"
          onClick={() => navigate(`/semesters`)}
        />
        <h2 className="class-title">Classes ({classes.length})</h2>
      </div>

      <div className="classes-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-class-button"
              onClick={() => navigate(`/semesters/${semesterId}/classes/add`)}
            >
              + Add Class
            </button>
          </div>
          <div className="actions__search-sort-container">
            <div className="actions__search">
              <Search handleSearchChange={handleSearchChange} />
            </div>
            <div className="actions__sort">
              <SortBy
                options={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                ]}
                onChange={setSortOption}
              />
            </div>
          </div>
        </div>
        <ClassesListHeader />
        <ClassesList classes={classes} refreshClasses={fetchClasses} />
      </div>
    </div>
  );
}

export default ClassesPage;
