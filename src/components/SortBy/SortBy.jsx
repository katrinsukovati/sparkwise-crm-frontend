import "./SortBy.scss";
import Select from "react-select";

function SortBy({ options }) {
  const formatOptionLabel = ({ label }, { context }) =>
    context === "value" ? `Sort by: ${label}` : label; // Add prefix only for selected value

  return (
    <div className="sort-by">
      <Select
        placeholder="Sort by:"
        options={options}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
}

export default SortBy;
