import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";

// import { GridComponent, ColumnsDirective, ColumnsDirective, Resize, Sort, ContextMenu}
const URL = import.meta.env.VITE_BACKEND_URL;

function ClientsPage() {
  const [clients, setClients] = useState([]);

  // Get Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${URL}/clients`);
        setClients(response.data);
      } catch (error) {
        setError("Failed to fetch clients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="content">
      {/* this will be a real client number, for now just template */}
      <div className="title">Clients (143) </div>
      <div className="main-container"></div>
    </div>
  );
}

export default ClientsPage;
