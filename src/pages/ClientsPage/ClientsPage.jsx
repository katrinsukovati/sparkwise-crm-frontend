import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientListHeader from "../../components/ClientListHeader/ClientListHeader";
import Button from "react-bootstrap/Button";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import TextButton from "../../components/TextButton/TextButton";
import ClientList from "../../components/ClientList/ClientList";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${URL}/clients`);
        setClients(response.data);
        console.log("Fetched clients:", response.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        setError("Failed to fetch clients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="content">
      <div className="title">Clients ({clients.length})</div>
      <div className="main-container">
        <div className="actions">
          <div className="actions__add">
            <button className="add-client-button">+ Add Client</button>
          </div>
          <div className="actions__search-sort-container">
            <div className="actions__search">
              <Search />
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
        <ClientList clients={clients} />
      </div>
    </div>
  );
}

export default ClientsPage;
