import { useState, useEffect } from "react";
import axios from "axios";
import "./StudentList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import StudentModal from "../StudentModal/StudentModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function StudentList({ refreshStudents }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${URL}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students.");
      }
    };

    fetchStudents();
  }, [refreshStudents]);

  const handleStudentClick = async (student) => {
    try {
      const enrollmentResponse = await axios.get(
        `${URL}/class-enrollments/student/${student.student_id}`
      );
      student.enrollments = enrollmentResponse.data;
    } catch (error) {
      console.error(
        `Error fetching enrollments for student ID ${student.student_id}:`,
        error
      );
      student.enrollments = [];
    }

    setSelectedStudent(student);
    setShowEditModal(true);
  };

  return (
    <div className="student-list">
      {error && <p className="error-message">{error}</p>}
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
              <div className="student-item__parent-container">
                <p className="student-item__parent label">
                  {student.parent_first_name} {student.parent_last_name}
                </p>
              </div>
              <div className="student-item__phone-container">
                <p className="student-item__phone label">
                  {student.parent_phone}
                </p>
              </div>
              <div className="student-item__parent-email-container">
                <p className="student-item__parent-email label">
                  {student.parent_email}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
