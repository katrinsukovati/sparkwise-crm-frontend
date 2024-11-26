import "./ClientListHeader.scss";
import { FaSort } from "react-icons/fa";

function ClientListHeader() {
  return (
    <div className="clients-header">
      <div className="clients-header__name-container">
        <p className="clients-header__name label">Customer Name</p>
      </div>
      <div className="clients-header__phone-container">
        <p className="clients-header__phone label">Phone Number</p>
      </div>
      <div className="clients-header__email-container">
        <p className="clients-header__email label">Email</p>
      </div>
      <div className="clients-header__cname-container">
        <p className="clients-header__cname label">Child's Name</p>
      </div>
      <div className="clients-header__grade-container">
        <p className="clients-header__grade label">Grade</p>
      </div>
      <div className="clients-header__subject-container">
        <p className="clients-header__subject label">Subjects</p>
      </div>
      <div className="clients-header__subject-container">
        <p className="clients-header__subject label">Status</p>
      </div>
    </div>
  );
}

export default ClientListHeader;
