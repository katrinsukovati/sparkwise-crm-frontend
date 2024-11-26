import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientListHeader from "../../components/ClientListHeader/ClientListHeader";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import ClientList from "../../components/ClientList/ClientList";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClientsPage() {
  const [clients, setClients] = useState([]);

  // for searching:
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // get all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${URL}/clients`);
        setClients(response.data);
        console.log("Fetched clients:", response.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        setError("Failed to fetch clients. Please try again.");
      }
    };

    fetchClients();
  }, []);

  // handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // reset to full client list if search is empty
      setFilteredClients(clients);
    } else {
      // filter clients based on search query
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter((client) =>
        Object.values(client).join(" ").toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="content">
      <div className="title">Clients ({filteredClients.length})</div>
      <div className="client-list-container">
        <div className="actions">
          <div className="actions__add">
            <button className="add-client-button">+ Add Client</button>
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
                  { value: "status", label: "Status" },
                  { value: "grade", label: "Grade" },
                ]}
              />
            </div>
          </div>
        </div>
        <ClientListHeader />
        <ClientList clients={filteredClients} />
      </div>
    </div>
  );
}

export default ClientsPage;
