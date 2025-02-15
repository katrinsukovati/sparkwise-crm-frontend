import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const URL = import.meta.env.VITE_BACKEND_URL;

const subjectsList = ["Math", "Science", "English", "Coding"];

const gradesList = ["Grades 1-3", "Grades 4-6", "Grades 7-8"];

const TeacherModal = ({
  show,
  handleClose,
  teacher,
  mode,
  refreshTeachers,
}) => {
  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    subjects: [],
    grades: [],
    additional_notes: "",
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (mode === "edit" && teacher) {
      setForm({
        first_name: teacher.first_name || "",
        last_name: teacher.last_name || "",
        email: teacher.email || "",
        phone_number: teacher.phone_number || "",
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects
          : teacher.subjects?.split(", ") || [],
        grades: Array.isArray(teacher.grades)
          ? teacher.grades
          : teacher.grades?.split(", ") || [],
        additional_notes: teacher.additional_notes || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [show, mode, teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [category]: Array.isArray(prev[category])
        ? checked
          ? [...prev[category], value]
          : prev[category].filter((item) => item !== value)
        : checked
        ? [value]
        : [],
    }));
  };

  const handleSave = async () => {
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.phone_number.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
        subjects: form.subjects,
        grades: form.grades,
        additional_notes: form.additional_notes,
      };

      if (mode === "add") {
        await axios.post(`${URL}/teachers`, payload);
        toast.success("Teacher added successfully!");
      } else if (mode === "edit" && teacher?.id) {
        await axios.put(`${URL}/teachers/${teacher.id}`, payload);
        toast.success("Teacher updated successfully!");
      }

      refreshTeachers();
      handleClose();
    } catch (error) {
      toast.error("Error saving teacher. Please try again.");
      console.error("Error saving teacher:", error.response?.data || error);
    }
  };

  const handleDelete = async () => {
    try {
      if (teacher?.id) {
        await axios.delete(`${URL}/teachers/${teacher.id}`);
        toast.success(
          `Successfully deleted teacher: ${teacher.first_name} ${teacher.last_name}`
        );
        refreshTeachers();
        handleClose();
      } else {
        toast.error("No teacher selected for deletion.");
      }
    } catch (error) {
      toast.error("Error deleting teacher. Please try again.");
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title style={{ fontSize: "1.4rem" }}>
          {mode === "add" ? "Add Teacher" : "Edit Teacher"}
        </Modal.Title>
        <IoClose onClick={handleClose} className="close-btn" />
      </Modal.Header>
      <Modal.Body style={{ fontSize: "0.85rem" }}>
        <Form>
          {/* Name Fields */}
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Email */}
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Phone Number */}
          <Form.Group className="mb-2">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Subjects */}
          <Form.Group className="mb-2">
            <Form.Label>Subjects</Form.Label>
            <div className="checkbox-group">
              {subjectsList.map((subject) => (
                <Form.Check
                  inline
                  key={subject}
                  type="checkbox"
                  label={subject}
                  value={subject}
                  checked={form.subjects.includes(subject)}
                  onChange={(e) => handleCheckboxChange(e, "subjects")}
                />
              ))}
            </div>
          </Form.Group>

          {/* Grades */}
          <Form.Group className="mb-2">
            <Form.Label>Grades</Form.Label>
            <div className="checkbox-group">
              {gradesList.map((grade) => (
                <Form.Check
                  inline
                  key={grade}
                  type="checkbox"
                  label={grade}
                  value={grade}
                  checked={form.grades.includes(grade)}
                  onChange={(e) => handleCheckboxChange(e, "grades")}
                />
              ))}
            </div>
          </Form.Group>

          {/* Additional Notes */}
          <Form.Group className="mb-2">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="additional_notes"
              value={form.additional_notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {mode === "edit" && (
          <Button variant="danger" onClick={handleDelete}>
            Delete Teacher
          </Button>
        )}
        <Button variant="primary" onClick={handleSave}>
          {mode === "add" ? "Add Teacher" : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherModal;
