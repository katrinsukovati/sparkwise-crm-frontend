import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ClassDetailsPage.scss";
import { IoArrowBack } from "react-icons/io5";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";
import { FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import TextButton from "../../components/TextButton/TextButton";
import { MdEdit } from "react-icons/md";

const URL = import.meta.env.VITE_BACKEND_URL;

const studentFields = [
  { key: "name", label: "Student Name" },
  { key: "grade", label: "Grade" },
  { key: "email", label: "Student Email" },
  { key: "parent_name", label: "Parent Name" },
  { key: "parent_phone", label: "Parent Phone" },
  { key: "parent_email", label: "Parent Email" },
  { key: "actions", label: "Actions" },
];

function ClassDetailsPage() {
  const { semesterId, classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Fetch class data
        const classRes = await axios.get(`${URL}/classes/${classId}`);
        setClassData(classRes.data);

        // Fetch enrolled students
        const enrolledRes = await axios.get(
          `${URL}/class-enrollments/${classId}/students`
        );
        setEnrolledStudents(
          enrolledRes.data.map((student) => ({
            ...student,
            name: `${student.first_name} ${student.last_name}`,
            parent_name: `${student.parent_first_name} ${student.parent_last_name}`,
          }))
        );

        // Fetch all students (filter out already enrolled ones)
        const studentsRes = await axios.get(`${URL}/students`);
        const allStudents = studentsRes.data;

        const unenrolledStudents = allStudents.filter(
          (student) =>
            !enrolledRes.data.some(
              (enrolled) => enrolled.id === student.student_id
            )
        );

        setAvailableStudents(
          unenrolledStudents.map((student) => ({
            value: student.student_id,
            label: `${student.first_name} ${student.last_name} (${student.parent_email})`,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching class details:", error);
        toast.error("Failed to load class details.");
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  // Handle adding a student
  const handleAddStudent = async () => {
    if (!selectedStudent) return toast.error("Please select a student.");
    try {
      await axios.post(`${URL}/class-enrollments`, {
        class_id: classId,
        student_id: selectedStudent.value,
      });

      toast.success("Student added successfully!");

      // **Fetch the full student data instead of adding manually**
      const updatedRes = await axios.get(
        `${URL}/class-enrollments/${classId}/students`
      );

      setEnrolledStudents(
        updatedRes.data.map((student) => ({
          ...student,
          name: `${student.first_name} ${student.last_name}`,
          parent_name: `${student.parent_first_name} ${student.parent_last_name}`,
        }))
      );

      // Update available students (remove the added student)
      setAvailableStudents((prev) =>
        prev.filter((student) => student.value !== selectedStudent.value)
      );

      setSelectedStudent(null);
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student.");
    }
  };

  // Function to handle removing a student from the class
  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      const enrollmentId = studentToRemove.enrollment_id;
      await axios.delete(`${URL}/class-enrollments/${enrollmentId}`);

      setEnrolledStudents((prev) =>
        prev.filter((student) => student.enrollment_id !== enrollmentId)
      );

      setAvailableStudents((prev) => [
        ...prev,
        {
          value: studentToRemove.student_id,
          label: `${studentToRemove.first_name} ${studentToRemove.last_name} (${studentToRemove.parent_email})`,
        },
      ]);

      setShowDeleteModal(false);
      toast.success(`${studentToRemove.name} was removed from the class.`);
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("Failed to remove student.");
    }
  };

  if (loading) return <div className="loading">Loading class details...</div>;
  if (!classData) return <div className="error-message">Class not found.</div>;

  return (
    <div className="content">
      <Breadcrumbs />
      {/* Back Arrow to Navigate to Semester Page */}
      <div className="title">
        <div className="title-back">
          <IoArrowBack
            className="back-arrow"
            onClick={() => navigate(`/semesters/${semesterId}/classes`)}
          />
          <h2 className="class-title">{classData.class_title}</h2>
        </div>
        <TextButton
          text={
            <>
              <MdEdit size={14} /> Edit Class
            </>
          }
          handleClick={() =>
            navigate(`/semesters/${semesterId}/classes/${classId}/edit`)
          }
        />
      </div>

      <div className="classes-list-container">
        <div className="class-info">
          <div className="class-info__title-and-arrow"></div>
          <div className="class-info__details-container">
            {/* Section: General Class Info */}
            <div className="class-info__details-section">
              <h4 className="class-info__section-title">General Info</h4>
              <p className="class-info__label">
                <strong>Teacher:</strong> {classData.teacher_first_name}{" "}
                {classData.teacher_last_name}
              </p>
              <p className="class-info__label">
                <strong>Start Date:</strong>{" "}
                {new Date(classData.start_date).toLocaleDateString()}
              </p>
              <p className="class-info__label">
                <strong>Occurrences:</strong> {classData.occurrences}
              </p>
            </div>

            {/* Section: Schedule */}
            <div className="class-info__details-section">
              <h4 className="class-info__section-title">Schedule</h4>
              <ul className="class-info__schedule">
                {classData.schedule.map((slot, index) => (
                  <li key={index}>
                    <strong>{slot.day}s:</strong> {slot.start_time} -{" "}
                    {slot.end_time}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section: Classroom & Zoom Info */}
            <div className="class-info__details-section">
              <h4 className="class-info__section-title">Online Details</h4>
              <p className="class-info__label">
                <strong>Google Classroom Code:</strong>{" "}
                {classData.google_classroom_code || "None"}
              </p>
              <p className="class-info__label">
                <strong>Zoom Link:</strong> {classData.zoom_link || "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="enrolled-students-header">
          <h4 className="enrolled-students-title">Enrolled Students</h4>
          <div className="add-student-wrapper">
            <Select
              className="add-student-dropdown"
              options={availableStudents}
              value={selectedStudent}
              onChange={setSelectedStudent}
              placeholder="Search and select student"
              isSearchable={true}
            />
            <button className="add-student-button" onClick={handleAddStudent}>
              + Add
            </button>
          </div>
        </div>

        {/* List header and enrolled student list */}
        <ListHeader headers={studentFields} />
        <List
          items={enrolledStudents}
          fields={studentFields}
          refreshData={() => setEnrolledStudents([...enrolledStudents])}
          disableClick={true}
          onItemClick={() => {}}
          renderCustomField={(field, student) => {
            if (field.key === "actions") {
              return (
                <FaTrashAlt
                  className="delete-icon"
                  size={18}
                  onClick={() => {
                    setStudentToRemove(student);
                    setShowDeleteModal(true);
                  }}
                  title="Remove Student"
                />
              );
            }
            return student[field.key] || "—";
          }}
        />
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleRemoveStudent}
        entityName={`${studentToRemove?.name}`}
        entityType="from this class"
      />
    </div>
  );
}
export default ClassDetailsPage;
