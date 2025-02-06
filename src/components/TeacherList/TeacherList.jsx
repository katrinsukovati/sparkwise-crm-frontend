import { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import TeacherModal from "../TeacherModal/TeacherModal";

const gradeOrder = ["Grades 1-3", "Grades 4-6", "Grades 7-8"];

function TeacherList({ teachers, refreshTeachers }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  return (
    <div className="teacher-list">
      {error && <p className="error-message">{error}</p>}
      <ul className="teachers__list">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
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
                    {teacher.grades
                      ?.slice()
                      .sort(
                        (a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b)
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="no-results">No teachers found.</p>
        )}
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
