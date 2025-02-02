import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

function SemesterModal({
  show,
  handleClose,
  mode,
  semester,
  refreshSemesters,
}) {
  const initialFormState = {
    name: "",
    start_date: "",
    end_date: "",
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (show && mode === "edit" && semester) {
      // Populate form with semester data for editing
      setForm({
        name: semester.name || "",
        start_date: semester.start_date ? formatDate(semester.start_date) : "",
        end_date: semester.end_date ? formatDate(semester.end_date) : "",
      });
    } else if (show && mode === "add") {
      // Reset the form for adding a new semester
      setForm(initialFormState);
    }
  }, [show, mode, semester]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.name || !form.start_date || !form.end_date) {
        toast.error("Please fill out all required fields.");
        return;
      }

      if (mode === "edit" && semester?.id) {
        await axios.put(`${URL}/semesters/${semester.id}`, form);
        toast.success("Semester updated successfully!");
      } else {
        await axios.post(`${URL}/semesters`, form);
        toast.success("Semester added successfully!");
      }
      refreshSemesters();
      handleClose();
    } catch (error) {
      toast.error("Failed to save semester.");
      console.error("Error saving semester:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit" ? "Edit Semester" : "Add Semester"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Semester Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SemesterModal;
