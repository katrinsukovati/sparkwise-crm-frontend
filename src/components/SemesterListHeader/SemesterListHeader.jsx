import "./SemesterListHeader.scss";

function SemesterListHeader() {
  return (
    <div className="semester-header">
      <div className="semester-header__name-container">
        <p className="semester-header__name label">Semester Name</p>
      </div>
      <div className="semester-header__classes-container">
        <p className="semester-header__classes label">Total Classes</p>
      </div>
      <div className="semester-header__students-container">
        <p className="semester-header__students label">Total Students</p>
      </div>
      <div className="semester-header__actions-container">
        <p className="semester-header__actions label">Actions</p>
      </div>
    </div>
  );
}

export default SemesterListHeader;
