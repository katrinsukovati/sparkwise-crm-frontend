import chevronIcon from "../../assets/icons/chevron_right-24px.svg";
import "./List.scss";

function List({ items, fields, onItemClick, renderCustomField, disableClick }) {
  return (
    <div className="list-container">
      <ul className="list-container__items">
        {items.map((item) => (
          <li key={item.id || item.parent_id} onClick={() => onItemClick(item)}>
            <div className="single-item">
              {fields.map(({ key }, index) => (
                <div
                  className="single-item__container"
                  key={`${item.id}-${key}`}
                >
                  {renderCustomField ? (
                    renderCustomField({ key }, item)
                  ) : (
                    <p className="single-item__label">{item[key]}</p>
                  )}
                  {index === 0 && !disableClick && (
                    <img src={chevronIcon} alt="arrow icon" className="icon" />
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
