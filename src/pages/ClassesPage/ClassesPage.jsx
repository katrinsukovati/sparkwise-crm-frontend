import "../ClassesPage/ClassesPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";

const URL = import.meta.env.VITE_BACKEND_URL;

const classesHeaders = [
  { key: "class_title", label: "Class Name" },
  { key: "teacher", label: "Teacher" },
  { key: "schedule", label: "Schedule" },
  { key: "students", label: "Students" },
  { key: "actions", label: "Actions" },
];

function ClassesPage() {
  const { semesterId } = useParams(); // Get semester ID from URL
  const navigate = useNavigate(); // Initialize navigate function
  const [semesterName, setSemesterName] = useState("");
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch Semester Name
  useEffect(() => {
    axios
      .get(`${URL}/semesters/${semesterId}`)
      .then((res) => setSemesterName(res.data.name))
      .catch((err) => console.error("Error fetching semester:", err));
  }, [semesterId]);

  // Fetch all classes for the given semester
  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${URL}/semesters/${semesterId}/classes`,
        {
          params: {
            search: searchQuery,
            sortBy: sortOption,
          },
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [semesterId, searchQuery, sortOption]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle deleting a class
  const handleConfirmDelete = async () => {
    if (!selectedClass) return;

    try {
      await axios.delete(`${URL}/classes/${selectedClass.id}`);
      fetchClasses();
      setShowDeleteModal(false);
      toast.success(`${selectedClass.class_title} has been removed.`);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

  // Format the class schedule to look better
  const formatSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return "No schedule provided";
    }
    return schedule
      .map((slot) => `${slot.day}s ${slot.start_time} - ${slot.end_time}`)
      .join(", ");
  };

  return (
    <div className="content">
      <Breadcrumbs />
      {/* Back Arrow to Navigate to Semester Page */}
      <div className="back-navigation">
        <IoArrowBack
          className="back-arrow"
          onClick={() => navigate(`/semesters`)}
        />
        <h2 className="class-title">Classes ({classes.length})</h2>
      </div>

      <div className="classes-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-class-button"
              onClick={() => navigate(`/semesters/${semesterId}/classes/add`)}
            >
              + Add Class
            </button>
          </div>
          <div className="actions__search-sort-container">
            <div className="actions__search">
              <Search handleSearchChange={handleSearchChange} />
            </div>
            <div className="actions__sort">
              <SortBy
                options={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                ]}
                onChange={setSortOption}
              />
            </div>
          </div>
        </div>
        {/* Header for each column */}
        <ListHeader headers={classesHeaders} />
        {/* List of classes */}
        <List
          items={classes}
          fields={classesHeaders}
          refreshData={fetchClasses}
          onItemClick={(classData) =>
            navigate(
              `/semesters/${classData.semester_id}/classes/${classData.id}`
            )
          }
          renderCustomField={(field, classData) => {
            if (field.key === "actions") {
              return (
                <FaTrashAlt
                  className="class-item__icon delete-icon"
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClass(classData);
                    setShowDeleteModal(true);
                  }}
                />
              );
            }
            if (field.key === "teacher") {
              return `${classData.teacher_first_name} ${classData.teacher_last_name}`;
            }
            if (field.key === "schedule") {
              return formatSchedule(classData.schedule);
            }
            if (field.key === "students") {
              return `${classData.student_count || 0} Students`;
            }
            return classData[field.key] || "—";
          }}
        />
      </div>

      {/* Delete modal */}
      {selectedClass && showDeleteModal && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onDelete={handleConfirmDelete}
          entityName={selectedClass?.class_title}
          entityType="class"
        />
      )}
    </div>
  );
}

export default ClassesPage;
