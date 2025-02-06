import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ClassDetailsPage.scss";
import { IoArrowBack } from "react-icons/io5";
import EnrolledStudentListHeader from "../../components/EnrolledStudentListHeader/EnrolledStudentListHeader";
import EnrolledStudentList from "../../components/EnrolledStudentList/EnrolledStudentList";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClassDetailsPage() {
  const { semesterId, classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        setEnrolledStudents(enrolledRes.data);
        console.log(enrolledRes);

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

      // Update UI
      setEnrolledStudents((prev) => [
        ...prev,
        {
          id: selectedStudent.value,
          first_name: selectedStudent.label.split(" ")[0],
          last_name: selectedStudent.label.split(" ")[1],
          parent_email: selectedStudent.label.match(/\(([^)]+)\)/)[1], // Extract parent email
        },
      ]);

      setAvailableStudents((prev) =>
        prev.filter((student) => student.value !== selectedStudent.value)
      );

      setSelectedStudent(null);
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student.");
    }
  };

  if (loading) return <div className="loading">Loading class details...</div>;
  if (!classData) return <div className="error-message">Class not found.</div>;

  return (
    <div className="content">
      <Breadcrumbs />
      {/* Back Arrow to Navigate to Semester Page */}
      <div className="back-navigation">
        <IoArrowBack
          className="back-arrow"
          onClick={() => navigate(`/semesters/${semesterId}/classes`)}
        />
        <h2 className="class-title">{classData.class_title}</h2>
      </div>

      <div className="classes-list-container">
        <div className="class-info">
          <div className="class-info__title-and-arrow"></div>
          <div className="class-info__details-container">
            {/* Secstion: General Class Info */}
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

        <EnrolledStudentListHeader />
        <EnrolledStudentList
          classId={classId}
          refreshStudents={() => setEnrolledStudents([...enrolledStudents])}
        />
      </div>
    </div>
  );
}
export default ClassDetailsPage;
