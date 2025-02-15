import "../TeachersPage/TeachersPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import TeacherModal from "../../components/TeacherModal/TeacherModal";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";

const URL = import.meta.env.VITE_BACKEND_URL;

const teacherFields = [
  { key: "name", label: "Teacher Name" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone Number" },
  { key: "subjects", label: "Subjects" },
  { key: "grades", label: "Grades" },
];

const gradeOrder = ["Grades 1-3", "Grades 4-6", "Grades 7-8"];

function TeachersPage() {
  // State for teachers, search, and modals
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${URL}/teachers`, {
        params: { search: searchQuery.trim() || undefined },
      });

      // Transform teacher data for display
      const formattedTeachers = response.data.map((teacher) => ({
        ...teacher,
        name: `${teacher.first_name} ${teacher.last_name}`,
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects.join(", ")
          : teacher.subjects || "",
        grades: Array.isArray(teacher.grades)
          ? teacher.grades
              .slice()
              .sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b))
              .join(", ")
          : teacher.grades || "",
      }));

      setTeachers(formattedTeachers);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      setTeachers([]);
    }
  };

  // Fetch teachers when search or sorting changes
  useEffect(() => {
    fetchTeachers();
  }, [searchQuery, sortOption]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Open edit modal when clicking a teacher
  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  return (
    <div className="content">
      <div className="title">Teachers ({teachers.length})</div>
      <div className="teacher-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-teacher-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Teacher
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

        {/* List Header */}
        <ListHeader headers={teacherFields} />

        {/* List Component */}
        <List
          items={teachers}
          fields={teacherFields}
          ModalComponent={TeacherModal}
          refreshData={fetchTeachers}
          onItemClick={handleTeacherClick}
        />
      </div>

      {/* Add Teacher Modal */}
      <TeacherModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshTeachers={fetchTeachers}
      />

      {/* Edit Teacher Modal */}
      {selectedTeacher && (
        <TeacherModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          teacher={selectedTeacher}
          refreshTeachers={fetchTeachers}
        />
      )}
    </div>
  );
}

export default TeachersPage;
