import "./ListHeader.scss";

function ListHeader({ headers }) {
  return (
    <div className="list-header">
      {headers.map((header) => (
        <div key={header.key} className="list-header__column">
          <p className="list-header__label">{header.label}</p>
        </div>
      ))}
    </div>
  );
}

export default ListHeader;
