// src/pages/AddClassPage/AddClassPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import "./AddClassPage.scss";
import WarningModal from "../../components/WarningModal/WarningModal";

import ClassForm from "../../components/ClassForm/ClassForm";

const URL = import.meta.env.VITE_BACKEND_URL;

function AddClassPage() {
  const { semesterId, classId } = useParams();
  const mode = classId ? "edit" : "create";
  const navigate = useNavigate();

  const [classTypeOptions, setClassTypeOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOptionsAndClass = async () => {
      try {
        const [ctRes, teacherRes, allStudentsRes] = await Promise.all([
          axios.get(`${URL}/class-types`),
          axios.get(`${URL}/teachers`),
          axios.get(`${URL}/students`),
        ]);

        setClassTypeOptions(
          ctRes.data.map((ct) => ({
            value: ct.id,
            label: `${ct.title} (${ct.subject}, Grades ${ct.grades})`,
          }))
        );

        setTeacherOptions(
          teacherRes.data.map((t) => ({
            value: t.id,
            label: `${t.first_name} ${t.last_name}`,
          }))
        );

        setStudentOptions(
          allStudentsRes.data.map((s) => ({
            value: s.student_id,
            label: `${s.first_name} ${s.last_name}`,
          }))
        );

        if (mode === "edit") {
          const [classRes, studentsRes] = await Promise.all([
            axios.get(`${URL}/classes/${classId}`),
            axios.get(`${URL}/class-enrollments/${classId}/students`),
          ]);

          if (classRes.data) {
            setInitialData({
              ...classRes.data,
              students: studentsRes.data.map((s) => ({
                value: s.id,
                label: `${s.first_name} ${s.last_name}`,
              })),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching form options:", error);
        toast.error("Failed to load form options.");
      }
    };

    fetchOptionsAndClass();
  }, [mode, classId]);

  const handleSaveClass = async (payload) => {
    try {
      payload.semester_id = semesterId;

      if (mode === "edit") {
        // Fetch the current enrolled students from the database
        const { data: currentEnrolledStudents } = await axios.get(
          `${URL}/class-enrollments/${classId}/students`
        );

        // Extract student IDs from the payload
        const currentStudentIds = currentEnrolledStudents.map((s) => s.id);
        const newStudentIds = payload.students.map((s) => s.value ?? s);

        // Find students to add
        const studentsToAdd = newStudentIds.filter(
          (id) => !currentStudentIds.includes(id)
        );

        // Find students to remove & get their enrollment IDs
        const studentsToRemove = currentEnrolledStudents.filter(
          (s) => !newStudentIds.includes(s.id)
        );

        // Update the class itself
        await axios.put(`${URL}/classes/${classId}`, payload);
        toast.success("Class updated successfully!");

        // Add new students
        await Promise.all(
          studentsToAdd.map((studentId) =>
            axios.post(`${URL}/class-enrollments`, {
              class_id: classId,
              student_id: studentId,
            })
          )
        );

        // Remove students (now using enrollment_id)
        await Promise.all(
          studentsToRemove.map((student) =>
            axios.delete(`${URL}/class-enrollments/${student.enrollment_id}`)
          )
        );

        toast.success("Student list updated!");
        navigate(`/semesters/${semesterId}/classes/${classId}`);
      } else {
        // Create a new class
        const res = await axios.post(`${URL}/classes`, payload);
        const newClass = res.data;

        if (!newClass?.id) {
          toast.error("No class ID returned; cannot enroll students.");
          return;
        }

        toast.success("Class created successfully!");
        payload.students = payload.students || [];

        // Enroll students
        await Promise.all(
          payload.students.map((studentId) =>
            axios.post(`${URL}/class-enrollments`, {
              class_id: newClass.id,
              student_id: studentId,
            })
          )
        );

        toast.success("Students enrolled!");
        navigate(`/semesters/${semesterId}/classes/${newClass.id}`);
      }
    } catch (err) {
      console.error("Error saving class:", err);
      toast.error("Failed to save class.");
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  return (
    <div className="content add-class-page">
      <div className="actions-header">
        <div className="title-with-arrow">
          <IoArrowBack className="back-arrow" onClick={() => handleCancel()} />

          <div className="new-class-title">
            {mode === "edit" ? "Edit Class" : "Add New Class"}
          </div>
        </div>
      </div>

      <div className="add-class-container">
        {mode === "edit" && !initialData ? (
          <div>Loading class data...</div>
        ) : (
          <ClassForm
            mode={mode}
            initialData={initialData || {}}
            onSubmit={handleSaveClass}
            onCancel={handleCancel}
            classTypeOptions={classTypeOptions}
            teacherOptions={teacherOptions}
            studentOptions={studentOptions}
          />
        )}
      </div>
      <WarningModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          if (mode === "edit") {
            navigate(`/semesters/${semesterId}/classes/${classId}`);
          } else {
            navigate(`/semesters/${semesterId}/classes`);
          }
        }}
        entityName={mode === "edit" ? "your class changes" : "the new class"}
      />
    </div>
  );
}

export default AddClassPage;
