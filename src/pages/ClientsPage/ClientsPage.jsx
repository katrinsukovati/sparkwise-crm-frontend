import "../ClientsPage/ClientsPage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientListHeader from "../../components/ClientListHeader/ClientListHeader";
import Search from "../../components/Search/Search";
import SortBy from "../../components/SortBy/SortBy";
import ClientList from "../../components/ClientList/ClientList";

const URL = import.meta.env.VITE_BACKEND_URL;

function ClientsPage() {
  // state for search, sort, clients, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // get all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${URL}/clients`, {
          params: {
            search: searchQuery,
            sortBy: sortOption,
          },
        });
        setClients(response.data); // update state with fetched clients
        setCurrentPage(1); // reset to the first page on new fetch
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, [searchQuery, sortOption]); // refetch when searchQuery or sortOption changes

  // handle search input when user types
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to the first page on search
  };

  return (
    <div className="content">
      <div className="title">Clients ({clients.length})</div>
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
                ]}
                onChange={setSortOption}
              />
            </div>
          </div>
        </div>
        <ClientListHeader />
        <ClientList
          clients={clients}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default ClientsPage;
