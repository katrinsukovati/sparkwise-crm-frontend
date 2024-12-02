import { useState } from "react";
import "./StudentList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import StudentModal from "../StudentModal/StudentModal";

function StudentList({ students, refreshStudents }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  return (
    <div className="student-list">
      <ul className="students__list">
        {students.map((student) => (
          <li key={student.student_id} className="student__item">
            <div
              className="student-item"
              onClick={() => handleStudentClick(student)}
              style={{ cursor: "pointer" }}
            >
              <div className="student-item__name-container">
                <p className="student-item__name label">
                  {student.first_name} {student.last_name}
                </p>
                <img
                  src={chevronIcon}
                  alt="arrow icon"
                  className="student-icon"
                />
              </div>
              <div className="student-item__grade-container">
                <p className="student-item__grade label">{student.grade}</p>
              </div>
              <div className="student-item__email-container">
                <p className="student-item__email label">{student.email}</p>
              </div>
              <div className="student-item__cname-container">
                <p className="student-item__cname label">
                  {student.parent_first_name} {student.parent_last_name}
                </p>
              </div>
              <div className="student-item__grade-container">
                <p className="student-item__grade label">
                  {student.parent_phone}
                </p>
              </div>
              <div className="student-item__subject-container">
                <p className="student-item__subject label">
                  {student.parent_email}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Student Modal */}
      {selectedStudent && (
        <StudentModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          student={selectedStudent}
          refreshStudents={refreshStudents}
        />
      )}
    </div>
  );
}

export default StudentList;
