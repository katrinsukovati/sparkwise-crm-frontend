import "./SemestersPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import SemesterListHeader from "../../components/SemesterListHeader/SemesterListHeader";
import SemesterList from "../../components/SemesterList/SemesterList";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import SemesterModal from "../../components/SemesterModal/SemesterModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function SemestersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [semesters, setSemesters] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch all semesters
  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${URL}/semesters`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  // Fetch semesters on initial render and when search/sort changes
  useEffect(() => {
    fetchSemesters();
  }, [searchQuery, sortOption]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Semesters ({semesters.length})</div>
      <div className="semester-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-semester-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Semester
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
        <SemesterListHeader />
        <SemesterList semesters={semesters} refreshSemesters={fetchSemesters} />
      </div>
      <SemesterModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshSemesters={fetchSemesters}
      />
    </div>
  );
}

export default SemestersPage;
