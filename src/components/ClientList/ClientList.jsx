import { useState } from "react";
import "./ClientList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import StatusLabel from "../StatusLabel/StatusLabel";
import ClientModal from "../ClientModal/ClientModal";

function ClientList({ clients, refreshClients }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  return (
    <div className="client-list">
      <ul className="clients__list">
        {clients.map((c) => (
          <li
            key={c.id}
            className="client__item"
            onClick={() => handleClientClick(c)}
          >
            <div className="client-item">
              <div
                className="client-item__name-container"
                style={{ cursor: "pointer" }}
              >
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
                <div className="client-item__status label">
                  <StatusLabel text={c.status} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Client Modal */}
      {selectedClient && (
        <ClientModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          mode="edit"
          client={selectedClient}
          refreshClients={refreshClients}
        />
      )}
    </div>
  );
}

export default ClientList;
