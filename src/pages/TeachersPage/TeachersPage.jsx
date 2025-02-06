import "../TeachersPage/TeachersPage.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TeacherListHeader from "../../components/TeacherListHeader/TeacherListHeader";
import Search from "../../components/Search/Search";
import TeacherList from "../../components/TeacherList/TeacherList";
import TeacherModal from "../../components/TeacherModal/TeacherModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function TeachersPage() {
  // states for searching teachers
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const filterRef = useRef(null); // For detecting outside clicks

  // Fetch teachers based on search query
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${URL}/teachers`, {
        params: { search: searchQuery.trim() || undefined },
      });
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      setTeachers([]);
    }
  };

  // Fetch teachers when search query changes
  useEffect(() => {
    fetchTeachers();
  }, [searchQuery]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Teachers ({teachers.length})</div>
      {/* Search Section */}
      <div className="teacher-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-teacher-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add teacher
            </button>
          </div>
          <div className="actions__search-container">
            <div className="actions__search">
              <Search handleSearchChange={handleSearchChange} />
            </div>
          </div>
        </div>
        <TeacherListHeader />
        <TeacherList teachers={teachers} refreshTeachers={fetchTeachers} />
      </div>

      {/* Add teacher Modal */}
      <TeacherModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshTeachers={fetchTeachers}
      />
    </div>
  );
}

export default TeachersPage;
