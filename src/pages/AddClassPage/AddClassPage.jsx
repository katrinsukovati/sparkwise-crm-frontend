// src/pages/AddClassPage/AddClassPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import "./AddClassPage.scss";

import ClassForm from "../../components/ClassForm/ClassForm";

const URL = import.meta.env.VITE_BACKEND_URL;

function AddClassPage() {
  const { semesterId } = useParams();
  const navigate = useNavigate();

  const [classTypeOptions, setClassTypeOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
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
      } catch (error) {
        toast.error("Failed to load form options.");
      }
    };
    fetchOptions();
  }, []);

  const handleCreateClass = async (payload) => {
    try {
      // attach semester_id
      payload.semester_id = semesterId;

      // create the class
      const res = await axios.post(`${URL}/classes`, payload);
      const newClass = res.data;

      if (!newClass?.id) {
        toast.error("No class ID returned; cannot enroll students.");
        return;
      }

      toast.success("Class created successfully!");

      // enroll students if any
      if (payload.students?.length > 0) {
        for (const studentId of payload.students) {
          await axios.post(`${URL}/class-enrollments`, {
            class_id: newClass.id,
            student_id: studentId,
          });
        }
        toast.success("Students enrolled!");
      }

      navigate(`/semesters/${semesterId}/classes`);
    } catch (err) {
      console.error("Error creating class:", err);
      toast.error("Failed to save class.");
    }
  };

  const handleCancel = () => {
    navigate(`/semesters/${semesterId}/classes`);
  };

  return (
    <div className="content add-class-page">
      <div className="actions-header">
        <div className="title-with-arrow">
          <IoArrowBack
            className="back-arrow"
            onClick={() => navigate(`/semesters/${semesterId}/classes`)}
          />
          <div className="new-class-title">Add New Class</div>
        </div>
      </div>

      <div className="add-class-container">
        <ClassForm
          mode="create"
          onSubmit={handleCreateClass}
          onCancel={handleCancel}
          classTypeOptions={classTypeOptions}
          teacherOptions={teacherOptions}
          studentOptions={studentOptions}
        />
      </div>
    </div>
  );
}

export default AddClassPage;
