import { useState, useEffect } from "react";
import "./ClientList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import PaginationFooter from "../PaginationFooter/PaginationFooter";

function ClientList({ clients }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // This is for pagination
  useEffect(() => {
    // this adjusts the amount of items per page based on screen size
    const updateItemsPerPage = () => {
      if (window.innerWidth > 1600) {
        setItemsPerPage(9);
      } else if (window.innerWidth > 1200) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(5);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const currentClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="client-list">
      <ul className="clients__list">
        {currentClients.map((c) => (
          <li key={c.id} className="client__item">
            <div className="client-item">
              <div className="client-item__name-container">
                <p className="client-item__name label">
                  {c.parent_first_name + " " + c.parent_last_name}
                </p>
                <img
                  src={chevronIcon}
                  alt="arrow icon"
                  className="client-icon"
                />
              </div>
              <div className="client-item__phone-container">
                <p className="client-item__phone label">{c.parent_phone}</p>
              </div>
              <div className="client-item__email-container">
                <p className="client-item__email label">{c.parent_email}</p>
              </div>
              <div className="client-item__cname-container">
                <p className="client-item__cname label">{c.child_first_name}</p>
              </div>
              <div className="client-item__grade-container">
                <p className="client-item__grade label">{c.child_grade}</p>
              </div>
              <div className="client-item__subject-container">
                <p className="client-item__subject label">
                  {c.subjects_interested}
                </p>
              </div>
              <div className="client-item__status-container">
                <p className="client-item__status label">{c.status}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={clients.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ClientList;
