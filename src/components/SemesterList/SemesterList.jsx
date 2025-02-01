import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SemesterList.scss";
import SemesterModal from "../SemesterModal/SemesterModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

function SemesterList({ semesters, refreshSemesters }) {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (semester, e) => {
    e.stopPropagation();
    setSelectedSemester(semester);
    setShowEditModal(true);
  };

  const handleDeleteClick = (semester, e) => {
    e.stopPropagation();
    console.log("Delete clicked for semester:", semester);
    setSelectedSemester(semester);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Delete confirmed");
      if (!selectedSemester?.id) {
        console.error("Semester ID is missing.");
        return;
      }

      console.log(`Deleting semester: ${selectedSemester.id}`);
      await axios.delete(`${URL}/semesters/${selectedSemester.id}`);
      toast.success("Semester deleted successfully!");
      refreshSemesters();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete semester.");
      console.error("Error deleting semester:", error);
    }
  };

  const handleSemesterClick = (semester) => {
    navigate(`/semesters/${semester.id}/classes`);
  };

  return (
    <div className="semester-list">
      <ul className="semesters__list">
        {semesters.map((semester) => (
          <li
            key={semester.id}
            className="semester__item"
            onClick={() => handleSemesterClick(semester)}
          >
            <div className="semester-item">
              <div
                className="client-item__name-container"
                style={{ cursor: "pointer" }}
              >
                <p className="client-item__name label">{semester.name}</p>
                <img
                  src={chevronIcon}
                  alt="arrow icon"
                  className="client-icon"
                />
              </div>
              <div className="semester-item__classes-container">
                <p className="semester-item__classes label">
                  {semester.total_classes || 0} Classes
                </p>
              </div>
              <div className="semester-item__students-container">
                <p className="semester-item__students label">
                  {semester.total_students || 0} Students
                </p>
              </div>
              <div className="semester-item__actions">
                <MdEdit
                  className="semester-item__icon edit-icon"
                  size={20}
                  onClick={(e) => handleEditClick(semester, e)}
                />
                <FaTrashAlt
                  className="semester-item__icon delete-icon"
                  size={18}
                  onClick={(e) => handleDeleteClick(semester, e)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedSemester && (
        <>
          <SemesterModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            mode="edit"
            semester={selectedSemester}
            refreshSemesters={refreshSemesters}
          />
          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onDelete={handleDeleteConfirm}
            entityName={selectedSemester?.name}
            entityType="semester"
          />
        </>
      )}
    </div>
  );
}

export default SemesterList;
