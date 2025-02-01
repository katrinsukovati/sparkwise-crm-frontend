import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClassesList.scss";
import { FaTrashAlt } from "react-icons/fa";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import axios from "axios";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClassesList({ classes, refreshClasses }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const formatSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return "No schedule provided";
    }
    return schedule
      .map((slot) => `${slot.day}s ${slot.start_time} - ${slot.end_time}`)
      .join(", ");
  };

  const handleDeleteClick = (classData, e) => {
    e.stopPropagation();
    setSelectedClass(classData);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClass) return;

    try {
      await axios.delete(`${URL}/classes/${selectedClass.id}`);
      refreshClasses();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

  // If user clicks entire row, maybe it goes to a detail page (or does nothing).
  const handleClassClick = (classData) => {
    navigate(`/semesters/${classData.semester_id}/classes/${classData.id}`);
  };

  return (
    <div className="classes-list">
      <ul className="classes__list">
        {classes.length > 0 ? (
          classes.map((c) => (
            <li
              key={c.id}
              className="class__item"
              onClick={() => handleClassClick(c)}
            >
              <div className="class-item">
                <div className="class-item__name-container">
                  <p className="class-item__name label">{c.class_title}</p>
                  <img
                    src={chevronIcon}
                    alt="arrow icon"
                    className="class-icon"
                  />
                </div>
                <div className="class-item__teacher-container">
                  <p className="class-item__teacher label">
                    {c.teacher_first_name} {c.teacher_last_name}
                  </p>
                </div>
                <div className="class-item__schedule-container">
                  <p className="class-item__schedule label">
                    {formatSchedule(c.schedule)}
                  </p>
                </div>
                <div className="class-item__students-container">
                  <p className="class-item__students label">
                    {c.student_count || 0} Students
                  </p>
                </div>
                <div className="class-item__actions">
                  <FaTrashAlt
                    className="class-item__icon delete-icon"
                    size={18}
                    onClick={(e) => handleDeleteClick(c, e)}
                  />
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="no-classes">No classes available</p>
        )}
      </ul>

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        entityName={selectedClass?.class_title}
        entityType="class"
      />
    </div>
  );
}

export default ClassesList;
