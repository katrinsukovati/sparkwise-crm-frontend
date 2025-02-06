import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ClientListHeader from "../../components/ClientListHeader/ClientListHeader";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import ClientList from "../../components/ClientList/ClientList";
import ClientModal from "../../components/ClientModal/ClientModal";

const URL = import.meta.env.VITE_BACKEND_URL;

const statusOptions = [
  "invoice sent",
  "trial completed",
  "trial scheduled",
  "new lead",
  "enrolled",
  "can't reach",
  "not a fit",
  "no show",
  "registration form filled",
];

function ClientsPage() {
  // states for search, sort, clients, and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [clients, setClients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]); // Default: nothing checked
  const [showFilterDropdown, setShowFilterDropdown] = useState(false); // Toggle dropdown
  const filterRef = useRef(null); // For detecting outside clicks

  // get all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${URL}/clients`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
          status:
            selectedStatuses.length > 0 ? selectedStatuses.join(",") : null, // Apply filter only if selected
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  // get clients when filters, search, or sorting changes
  useEffect(() => {
    fetchClients();
  }, [searchQuery, sortOption, selectedStatuses]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle selecting/unselecting a status
  const handleStatusChange = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Remove a selected status filter (by clicking anywhere on the tag)
  const removeStatusFilter = (status) => {
    setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="content">
      <div className="title">Clients ({clients.length})</div>

      {/* Search, Sort, and Filter Section */}
      <div className="client-list-container">
        <div className="actions">
          <div className="actions__add">
            <button
              className="add-client-button"
              onClick={() => setShowAddModal(true)}
            >
              + Add Client
            </button>
          </div>
          <div className="actions__search-sort-container">
            {/* Filter by Status Button */}
            <div className="actions__filter" ref={filterRef}>
              <button
                className="filter-button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                Filter by Status ▾
              </button>
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  {statusOptions.map((status) => (
                    <label key={status}>
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              )}
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
            <div className="actions__search">
              <Search handleSearchChange={handleSearchChange} />
            </div>
          </div>
        </div>

        {/* Display Active Filters */}
        {selectedStatuses.length > 0 && (
          <div className="selected-filters">
            {selectedStatuses.map((status) => (
              <div
                className="filter-tag"
                key={status}
                onClick={() => removeStatusFilter(status)}
              >
                {status} <span className="remove-tag">x</span>
              </div>
            ))}
          </div>
        )}

        <ClientListHeader />
        <ClientList clients={clients} refreshClients={fetchClients} />
      </div>

      {/* Add Client Modal */}
      <ClientModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshClients={fetchClients}
      />
    </div>
  );
}

export default ClientsPage;
