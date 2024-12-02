import "../StudentsPage/StudentsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentListHeader from "../../components/StudentListHeader/StudentListHeader";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import StudentList from "../../components/StudentList/StudentList";
import StudentModal from "../../components/StudentModal/StudentModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function StudentsPage() {
  // states for search, sort, and students
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // get all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${URL}/students`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });

      // make sure all students have necessary fields
      const validStudents = response.data.filter(
        (student) => student && student.first_name && student.last_name
      );

      setStudents(validStudents);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // get students when search query or sort option changes
  useEffect(() => {
    fetchStudents();
  }, [searchQuery, sortOption]);

  // this handles search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Students ({students.length})</div>
      <div className="student-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-student-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Student
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
        <StudentListHeader />
        <StudentList students={students} refreshStudents={fetchStudents} />
      </div>
      <StudentModal
        show={showAddModal} // show or hide the modal
        handleClose={() => setShowAddModal(false)} // close modal
        mode="add" // specify the mode - either add or edit
        refreshStudents={fetchStudents} // pass fetchStudents to refresh list on save/edit
      />
    </div>
  );
}

export default StudentsPage;
