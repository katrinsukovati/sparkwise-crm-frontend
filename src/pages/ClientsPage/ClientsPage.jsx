import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import ClientModal from "../../components/ClientModal/ClientModal";
import ListHeader from "../../components/ListHeader/ListHeader";
import List from "../../components/List/List";
import StatusLabel from "../../components/StatusLabel/StatusLabel";

const URL = import.meta.env.VITE_BACKEND_URL;

const clientHeaders = [
  { key: "parent_name", label: "Parent Name" },
  { key: "parent_phone", label: "Parent Phone" },
  { key: "parent_email", label: "Parent Email" },
  { key: "child_first_name", label: "Child Name" },
  { key: "child_grade", label: "Child Grade" },
  { key: "subjects_interested", label: "Subjects" },
  { key: "status", label: "Status" },
];

function ClientsPage() {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${URL}/clients`, {
        params: {
          search: searchQuery,
          sortBy: sortOption,
        },
      });

      const transformedClients = response.data.map((client) => ({
        ...client,
        parent_name: `${client.parent_first_name} ${client.parent_last_name}`,
      }));

      console.log(transformedClients);

      setClients(transformedClients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery, sortOption]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
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
              <Search
                handleSearchChange={(e) => setSearchQuery(e.target.value)}
              />
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

        {/* List headers */}
        <ListHeader headers={clientHeaders} />
        {/* List of clients */}
        <List
          items={clients}
          fields={clientHeaders}
          ModalComponent={ClientModal}
          refreshData={fetchClients}
          onItemClick={handleClientClick}
          renderCustomField={(field, client) =>
            field.key === "status" ? (
              <div className="client-item__status-container">
                <div className="client-item__status label">
                  <StatusLabel text={client.status} />
                </div>
              </div>
            ) : (
              client[field.key]
            )
          }
        />
      </div>

      {/* Add Client Modal */}
      <ClientModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        mode="add"
        refreshClients={fetchClients}
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <ClientModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          client={selectedClient}
          refreshClients={fetchClients}
        />
      )}
    </div>
  );
}

export default ClientsPage;
