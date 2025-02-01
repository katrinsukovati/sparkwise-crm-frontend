import "./ClassesListHeader.scss";

function ClassesListHeader() {
  return (
    <div className="classes-header">
      <div className="classes-header__name-container">
        <p className="classes-header__name label">Class Name</p>
      </div>
      <div className="classes-header__teacher-container">
        <p className="classes-header__teacher label">Teacher</p>
      </div>
      <div className="classes-header__schedule-container">
        <p className="classes-header__schedule label">Schedule</p>
      </div>
      <div className="classes-header__students-container">
        <p className="classes-header__students label">Students</p>
      </div>
      <div className="classes-header__actions-container">
        <p className="classes-header__actions label">Actions</p>
      </div>
    </div>
  );
}

export default ClassesListHeader;
