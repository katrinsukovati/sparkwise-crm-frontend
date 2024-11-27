import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientListHeader from "../../components/ClientListHeader/ClientListHeader";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import ClientList from "../../components/ClientList/ClientList";
import ClientModal from "../../components/ClientModal/ClientModal";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClientsPage() {
  // states for search, sort, and clients
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [clients, setClients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // get all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${URL}/clients`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  // get clients when search query or sort option changes
  useEffect(() => {
    fetchClients();
  }, [searchQuery, sortOption]);

  // this handles search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Clients ({clients.length})</div>
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
        <ClientListHeader />
        <ClientList clients={clients} refreshClients={fetchClients} />
      </div>
      <ClientModal
        show={showAddModal} // show or hide the modal
        handleClose={() => setShowAddModal(false)} // close modal
        mode="add" // specify the mode - either add or edit
        refreshClients={fetchClients} // pass fetchClients to refresh list on save/edit
      />
    </div>
  );
}

export default ClientsPage;
