import { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import TeacherModal from "../TeacherModal/TeacherModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function TeacherList({ refreshTeachers }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${URL}/teachers`);
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers.");
      }
    };

    fetchTeachers();
  }, [refreshTeachers]);

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  return (
    <div className="teacher-list">
      {error && <p className="error-message">{error}</p>}
      <ul className="teachers__list">
        {teachers.map((teacher) => (
          <li key={teacher.id} className="teacher__item">
            <div
              className="teacher-item"
              onClick={() => handleTeacherClick(teacher)}
              style={{ cursor: "pointer" }}
            >
              <div className="teacher-item__name-container">
                <p className="teacher-item__name label">
                  {teacher.first_name} {teacher.last_name}
                </p>
                <img
                  src={chevronIcon}
                  alt="arrow icon"
                  className="teacher-icon"
                />
              </div>
              <div className="teacher-item__email-container">
                <p className="teacher-item__email label">{teacher.email}</p>
              </div>
              <div className="teacher-item__phone-container">
                <p className="teacher-item__phone label">
                  {teacher.phone_number}
                </p>
              </div>
              <div className="teacher-item__subjects-container">
                <p className="teacher-item__subjects label">
                  {teacher.subjects?.join(", ")}
                </p>
              </div>
              <div className="teacher-item__grades-container">
                <p className="teacher-item__grades label">
                  {teacher.grades?.join(", ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedTeacher && (
        <TeacherModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          teacher={selectedTeacher}
          refreshTeachers={refreshTeachers}
        />
      )}
    </div>
  );
}

export default TeacherList;
