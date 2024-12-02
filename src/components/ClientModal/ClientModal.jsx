import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "./ClientModal.scss";
import { IoClose } from "react-icons/io5";
import "./ClientModal.scss";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

const ClientModal = ({ show, handleClose, client, mode, refreshClients }) => {
  const initialFormState = {
    parent_first_name: "",
    parent_last_name: "",
    parent_email: "",
    parent_phone: "",
    child_first_name: "",
    child_grade: "",
    subjects_interested: [],
    city: "",
    postal_code: "",
    additional_notes: "",
    status: "new lead",
    how_did_you_hear: "",
  };

  const [form, setForm] = useState(initialFormState);

  const statusOptions = [
    { value: "new lead", label: "New Lead" },
    { value: "invoice sent", label: "Invoice Sent" },
    { value: "trial completed", label: "Trial Completed" },
    { value: "trial scheduled", label: "Trial Scheduled" },
    { value: "enrolled", label: "Enrolled" },
    { value: "can't reach", label: "Can't Reach" },
    { value: "not a fit", label: "Not a Fit" },
    { value: "no show", label: "No Show" },
  ];

  useEffect(() => {
    if (show) {
      if (mode === "edit" && client) {
        setForm({
          parent_first_name: client.parent_first_name || "",
          parent_last_name: client.parent_last_name || "",
          parent_email: client.parent_email || "",
          parent_phone: client.parent_phone || "",
          child_first_name: client.child_first_name || "",
          child_grade: client.child_grade || "",
          city: client.city || "",
          postal_code: client.postal_code || "",
          subjects_interested: client.subjects_interested?.split(", ") || [],
          additional_notes: client.additional_notes || "",
          status: client.status.toLowerCase() || "new lead",
          how_did_you_hear: client.how_did_you_hear || "",
        });
      } else {
        setForm(initialFormState);
      }
    }
  }, [show, mode, client]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        subjects_interested: checked
          ? [...prev.subjects_interested, value]
          : prev.subjects_interested.filter((subject) => subject !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      status: selectedOption.value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        subjects_interested: form.subjects_interested.join(", "),
      };

      if (mode === "add") {
        await axios.post(`${URL}/clients`, payload);
        toast.success("Client added successfully!");
      } else if (mode === "edit" && client?.id) {
        await axios.put(`${URL}/clients/${client.id}`, payload);
        toast.success("Client updated successfully!");
      } else {
        toast.error("Invalid mode or missing client ID");
      }
      refreshClients();
      handleClose();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error saving client:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${URL}/clients/${client?.id}`);
      if (response.status === 204) {
        toast.success(
          `Successfully deleted client ${client.parent_first_name} ${client.parent_last_name}.`
        );
      }
      refreshClients();
      handleClose();
    } catch (error) {
      toast.error(
        `Error deleting ${client.parent_first_name} ${client.parent_last_name} with ID ${client.id}.`
      );
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "1.4rem" }}>
            {mode === "add" ? "Add Client" : "Edit Client"}
          </Modal.Title>
          <IoClose onClick={handleClose} className="close-btn" />
        </Modal.Header>
        <Modal.Body style={{ fontSize: "0.85rem" }}>
          <Form>
            {/* Parent Name */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Parent First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_first_name"
                    value={form.parent_first_name}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Parent Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_last_name"
                    value={form.parent_last_name}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Contact Information */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="parent_email"
                    value={form.parent_email}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_phone"
                    value={form.parent_phone}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Child Information */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Child First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="child_first_name"
                    value={form.child_first_name}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Child Grade</Form.Label>
                  <Form.Control
                    type="text"
                    name="child_grade"
                    value={form.child_grade}
                    onChange={handleChange}
                    required
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Address */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Subjects */}
            <Form.Group className="mb-2">
              <Form.Label>Subjects Interested In</Form.Label>
              <div>
                {["English", "Coding", "Math", "Science"].map((subject) => (
                  <Form.Check
                    inline
                    key={subject}
                    type="checkbox"
                    label={subject}
                    name="subjects_interested"
                    value={subject}
                    checked={form.subjects_interested.includes(subject)}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Status and Notes */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === form.status
                    )}
                    onChange={handleStatusChange}
                    placeholder="Select Status"
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: "2rem",
                        fontSize: "0.85rem",
                      }),
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>How Did You Hear About Us?</Form.Label>
                  <Form.Control
                    type="text"
                    name="how_did_you_hear"
                    value={form.how_did_you_hear}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Notes */}
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additional_notes"
                value={form.additional_notes}
                onChange={handleChange}
                style={{ padding: "0.25rem", fontSize: "0.85rem" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {mode === "edit" && (
            <Button
              variant="danger"
              onClick={handleDelete}
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              Delete Client
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleSave}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            {mode === "add" ? "Add Client" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClientModal;
