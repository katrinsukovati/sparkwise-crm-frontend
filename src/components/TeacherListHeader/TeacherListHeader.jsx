import "./TeacherListHeader.scss";

function TeacherListHeader() {
  return (
    <div className="teachers-header">
      <div className="teachers-header__name-container">
        <p className="teachers-header__name label">Teacher Name</p>
      </div>
      <div className="teachers-header__email-container">
        <p className="teachers-header__email label">Email</p>
      </div>
      <div className="teachers-header__number-container">
        <p className="teachers-header__number label">Phone Number</p>
      </div>
      <div className="teachers-header__subjects-container">
        <p className="teachers-header__subjects label">Subjects</p>
      </div>
      <div className="teachers-header__grades-container">
        <p className="teachers-header__grades label">Grades</p>
      </div>
    </div>
  );
}

export default TeacherListHeader;
