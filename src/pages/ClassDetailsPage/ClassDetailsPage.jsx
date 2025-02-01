import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClassDetailsPage.scss";
import { IoArrowBack } from "react-icons/io5";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClassDetailsPage() {
  const { semesterId, classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        // 1) fetch the class
        const res = await axios.get(`${URL}/classes/${classId}`);
        setClassData(res.data);

        // 2) fetch enrolled students if you want
        const studentRes = await axios.get(
          `${URL}/class-enrollments/${classId}/students`
        );
        setEnrolledStudents(studentRes.data);
        console.log(studentRes);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching class details:", error);
        setLoading(false);
      }
    };
    fetchClass();
  }, [classId]);

  if (loading) return <div>Loading class details...</div>;
  if (!classData) return <div>Class not found or error loading data.</div>;

  return (
    <div className="content class-details-page">
      <div className="actions-header">
        <div className="title-with-arrow">
          <IoArrowBack
            className="back-arrow"
            onClick={() => navigate(`/semesters/${semesterId}/classes`)}
          />
          <h2>Class Details</h2>
        </div>
      </div>

      <div className="class-details-container">
        <div className="class-info">
          <p>
            <strong>ID:</strong> {classData.id}
          </p>
          <p>
            <strong>Class Type:</strong> {classData.class_title} (ID:{" "}
            {classData.class_type_id})
          </p>
          <p>
            <strong>Teacher:</strong> {classData.teacher_first_name}{" "}
            {classData.teacher_last_name} (ID: {classData.teacher_id})
          </p>
          <p>
            <strong>Start Date:</strong> {classData.start_date}
          </p>
          <p>
            <strong>Occurrences:</strong> {classData.occurrences}
          </p>
          <p>
            <strong>Zoom Link:</strong> {classData.zoom_link || "None"}
          </p>
          <p>
            <strong>Google Classroom Code:</strong>{" "}
            {classData.google_classroom_code || "None"}
          </p>
          <p>
            <strong>Internal Notes:</strong>{" "}
            {classData.internal_notes || "None"}
          </p>

          <h4>Schedule:</h4>
          {Array.isArray(classData.schedule) &&
          classData.schedule.length > 0 ? (
            classData.schedule.map((slot, index) => (
              <p key={index}>
                {slot.day}: {slot.start_time} - {slot.end_time}
              </p>
            ))
          ) : (
            <p>No schedule found.</p>
          )}
        </div>

        <div className="students-info">
          <h4>Enrolled Students:</h4>

          {enrolledStudents.length > 0 ? (
            enrolledStudents.map((s) => (
              <p key={s.id}>
                {s.first_name} {s.last_name} (ID: {s.id})
              </p>
            ))
          ) : (
            <p>No students enrolled.</p>
          )}
        </div>

        <div className="actions-footer">
          <button
            className="edit-class-button"
            onClick={() =>
              navigate(`/semesters/${semesterId}/classes/${classId}/edit`)
            }
          >
            Edit Class
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailsPage;
