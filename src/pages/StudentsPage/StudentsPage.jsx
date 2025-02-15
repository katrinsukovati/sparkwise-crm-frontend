import "../StudentsPage/StudentsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import StudentModal from "../../components/StudentModal/StudentModal";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";

const URL = import.meta.env.VITE_BACKEND_URL;

const studentFields = [
  { key: "name", label: "Student Name" },
  { key: "grade", label: "Grade" },
  { key: "email", label: "Student Email" },
  { key: "parent_name", label: "Parent Name" },
  { key: "parent_phone", label: "Parent Phone" },
  { key: "parent_email", label: "Parent Email" },
];

function StudentsPage() {
  // states for search, sort, students, and modal
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // get all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${URL}/students`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });

      const validStudents = response.data.map((student) => ({
        ...student,
        name: `${student.first_name} ${student.last_name}`,
        parent_name: `${student.parent_first_name} ${student.parent_last_name}`,
      }));

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

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
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
        <ListHeader headers={studentFields} />
        <List
          items={students}
          fields={studentFields}
          ModalComponent={StudentModal}
          refreshData={fetchStudents}
          onItemClick={handleStudentClick}
        />
      </div>
      <StudentModal
        show={showAddModal} // show or hide the modal
        handleClose={() => setShowAddModal(false)} // close modal
        mode="add" // specify the mode - either add or edit
        refreshStudents={fetchStudents} // pass fetchStudents to refresh list on save/edit
      />

      {/*Edit Student Modal */}
      {selectedStudent && (
        <StudentModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          student={selectedStudent}
          refreshStudents={fetchStudents}
        />
      )}
    </div>
  );
}

export default StudentsPage;
