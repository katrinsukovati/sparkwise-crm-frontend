import { Link, useParams } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import axios from "axios";
import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_BACKEND_URL;

function Breadcrumbs() {
  const { semesterId, classId } = useParams();
  const [semesterName, setSemesterName] = useState("");
  const [className, setClassName] = useState("");

  // Fetch Semester Name
  useEffect(() => {
    if (semesterId) {
      axios
        .get(`${URL}/semesters/${semesterId}`)
        .then((res) => setSemesterName(res.data.name))
        .catch((err) => console.error("Error fetching semester:", err));
    }
  }, [semesterId]);

  // Fetch Class Name
  useEffect(() => {
    if (classId) {
      axios
        .get(`${URL}/classes/${classId}`)
        .then((res) => setClassName(res.data.class_title))
        .catch((err) => console.error("Error fetching class:", err));
    }
  }, [classId]);

  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/semesters" }}>
        Semesters
      </Breadcrumb.Item>

      {semesterId && (
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/semesters/${semesterId}/classes` }}
        >
          {semesterName || "Loading..."}
        </Breadcrumb.Item>
      )}

      {classId && (
        <Breadcrumb.Item active>{className || "Loading..."}</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}

export default Breadcrumbs;
