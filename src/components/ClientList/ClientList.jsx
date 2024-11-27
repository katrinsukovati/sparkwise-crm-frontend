import { useEffect } from "react";
import "./ClientList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import PaginationFooter from "../PaginationFooter/PaginationFooter";
import StatusLabel from "../StatusLabel/StatusLabel";

function ClientList({ clients, currentPage, setCurrentPage }) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  // calculate the clients to display on the current page
  const currentClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    // ensure currentPage is valid when the number of pages changes
    if (currentPage > totalPages) {
      setCurrentPage(1); // reset to page 1 if out of bounds
    }
  }, [totalPages, currentPage, setCurrentPage]);

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
                <p className="client-item__status label">
                  <StatusLabel text={c.status} />
                </p>
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
