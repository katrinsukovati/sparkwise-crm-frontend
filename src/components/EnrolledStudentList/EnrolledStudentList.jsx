import { useState, useEffect } from "react";
import axios from "axios";
import "./EnrolledStudentList.scss";
import { FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { toast } from "react-toastify";

const URL = import.meta.env.VITE_BACKEND_URL;

function EnrolledStudentList({ classId, refreshStudents }) {
  const [error, setError] = useState("");
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Fetch enrolled students
        const enrolledRes = await axios.get(
          `${URL}/class-enrollments/${classId}/students`
        );
        setEnrolledStudents(enrolledRes.data);

        // Fetch all students (filter out already enrolled ones)
        const studentsRes = await axios.get(`${URL}/students`);
        const allStudents = studentsRes.data;
      } catch (error) {
        console.error("Error fetching class details:", error);
        setError("Failed to load class details.");
      }
    };

    fetchClassDetails();
  }, [classId, refreshStudents]);

  // Function to handle removing a student from the class
  const handleRemoveStudent = async () => {
    if (!selectedStudent) return;

    try {
      const enrollmentId = selectedStudent.enrollment_id;
      await axios.delete(`${URL}/class-enrollments/${enrollmentId}`);

      setEnrolledStudents((prev) =>
        prev.filter((student) => student.enrollment_id !== enrollmentId)
      );

      setShowDeleteModal(false);
      toast.success(
        `${selectedStudent.first_name} ${selectedStudent.last_name} was removed from the class.`
      );
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  return (
    <div className="student-list">
      {error && <p className="error-message">{error}</p>}
      <ul className="students__list">
        {enrolledStudents.map((student) => (
          <li key={student.id} className="student__item">
            <div className="student-item">
              <div className="student-item__name-container">
                <p className="student-item__name label">
                  {student.first_name} {student.last_name}
                </p>
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
              <div className="student-item__actions-container">
                <FaTrashAlt
                  className="remove-icon"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowDeleteModal(true);
                  }}
                  title="Remove Student"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleRemoveStudent}
        entityName={`${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
        entityType="from this class"
      />
    </div>
  );
}

export default EnrolledStudentList;
