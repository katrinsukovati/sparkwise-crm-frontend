import "./SemestersPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import SemesterModal from "../../components/SemesterModal/SemesterModal";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TextButton from "../../components/TextButton/TextButton";

const URL = import.meta.env.VITE_BACKEND_URL;

const semesterHeaders = [
  { key: "name", label: "Semester Name" },
  { key: "total_classes", label: "Total Classes" },
  { key: "total_students", label: "Total Students" },
  { key: "actions", label: "Actions" },
];

function SemestersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [semesters, setSemesters] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  // Fetch all semesters
  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${URL}/semesters`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

  // Fetch semesters on initial render and when search/sort changes
  useEffect(() => {
    fetchSemesters();
  }, [searchQuery, sortOption]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Semesters ({semesters.length})</div>
      <div className="semester-list-container">
        <div className="actions">
          <div className="actions__add">
            <TextButton
              text={"+ Add Semester"}
              handleClick={() => setShowAddModal(true)}
            />
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
        <ListHeader headers={semesterHeaders} />
        <List
          items={semesters}
          fields={semesterHeaders}
          ModalComponent={SemesterModal}
          refreshData={fetchSemesters}
          onItemClick={(semester) =>
            navigate(`/semesters/${semester.id}/classes`)
          }
          renderCustomField={(field, semester) =>
            field.key === "actions" ? (
              <div className="semester-item__actions">
                <MdEdit
                  className="semester-item__icon edit-icon"
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSemester(semester);
                    setShowEditModal(true);
                  }}
                />
                <FaTrashAlt
                  className="semester-item__icon delete-icon"
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSemester(semester);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
            ) : (
              semester[field.key] || 0
            )
          }
        />
      </div>

      {/* Add Semester Modal */}
      <SemesterModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshSemesters={fetchSemesters}
      />

      {/* Edit Semester Modal */}
      {selectedSemester && showEditModal && (
        <SemesterModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          semester={selectedSemester}
          refreshSemesters={fetchSemesters}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedSemester && showDeleteModal && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onDelete={async () => {
            try {
              await axios.delete(`${URL}/semesters/${selectedSemester.id}`);
              toast.success("Semester deleted successfully!");
              fetchSemesters();
            } catch (error) {
              toast.error("Failed to delete semester.");
            }
            setShowDeleteModal(false);
          }}
          entityName={selectedSemester.name}
          entityType="semester"
        />
      )}
    </div>
  );
}

export default SemestersPage;
