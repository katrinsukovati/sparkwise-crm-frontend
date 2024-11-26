import "./ClientList.scss";
import chevronIcon from "../../assets/icons/chevron_right-24px.svg";

function ClientList({ clients }) {
  return (
    <>
      <ul className="clients__list">
        {clients.map((c) => (
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
    </>
  );
}

export default ClientList;
