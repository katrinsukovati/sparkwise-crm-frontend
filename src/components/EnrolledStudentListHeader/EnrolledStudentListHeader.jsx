import "./EnrolledStudentListHeader.scss";

function EnrolledStudentListHeader() {
  return (
    <div className="enrolled-student-header">
      <div className="enrolled-student-header__name-container">
        <p className="enrolled-student-header__name label">Student Name</p>
      </div>
      <div className="enrolled-student-header__grade-container">
        <p className="enrolled-student-header__grade label">Grade</p>
      </div>
      <div className="enrolled-student-header__email-container">
        <p className="enrolled-student-header__email label">Student Email</p>
      </div>
      <div className="enrolled-student-header__phone-container">
        <p className="enrolled-student-header__phone label">Parent Name</p>
      </div>
      <div className="enrolled-student-header__cname-container">
        <p className="enrolled-student-header__cname label">Parent Phone</p>
      </div>
      <div className="enrolled-student-header__subject-container">
        <p className="enrolled-student-header__subject label">Parent Email</p>
      </div>
      <div className="enrolled-student-header__actions-container">
        <p className="enrolled-student-header__actions label">Actions</p>
      </div>
    </div>
  );
}

export default EnrolledStudentListHeader;
