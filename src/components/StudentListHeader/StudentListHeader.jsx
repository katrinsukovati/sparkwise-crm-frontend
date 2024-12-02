import "./StudentListHeader.scss";

function StudentListHeader() {
  return (
    <div className="students-header">
      <div className="students-header__name-container">
        <p className="students-header__name label">Student Name</p>
      </div>
      <div className="students-header__grade-container">
        <p className="students-header__grade label">Grade</p>
      </div>
      <div className="students-header__email-container">
        <p className="students-header__email label">Student Email</p>
      </div>
      <div className="students-header__phone-container">
        <p className="students-header__phone label">Parent Name</p>
      </div>
      <div className="students-header__cname-container">
        <p className="students-header__cname label">Parent Phone</p>
      </div>
      <div className="students-header__subject-container">
        <p className="students-header__subject label">Parent Email</p>
      </div>
    </div>
  );
}

export default StudentListHeader;
