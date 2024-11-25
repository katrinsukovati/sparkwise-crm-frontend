import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { IoClose } from "react-icons/io5";
import "./AddEventModal.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEventModal({ show, handleClose, accessToken, refreshEvents }) {
  const initialFormState = {
    summary: "",
    description: "",
    start: "",
    end: "",
  };

  const [form, setForm] = useState(initialFormState);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Clear form when modal closes or event is saved
  useEffect(() => {
    if (!show) {
      setForm(initialFormState);
      setStartDate("");
      setStartTime("");
      setEndTime("");
    }
  }, [show]);

  const handleSave = async () => {
    try {
      if (!startDate || !startTime || !endTime) {
        toast.error("Please enter valid start and end dates and times.");
        return;
      }

      // Construct the correct dateTime strings
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${startDate}T${endTime}`).toISOString();

      // Construct the payload for the new event
      const payload = {
        summary: form.summary,
        description: form.description,
        start: {
          dateTime: startDateTime,
        },
        end: {
          dateTime: endDateTime,
        },
      };

      await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      refreshEvents(); // Refresh events on the calendar
      handleClose(); // Close modal
      toast.success("Event has been added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add the event. Please try again.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Add New Event</Modal.Title>
          <IoClose onClick={handleClose} className="close-btn" />
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title */}
            <Form.Group className="mb-3" controlId="formEventTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="summary"
                value={form.summary}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </Form.Group>

            {/* Start Date */}
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>

            {/* Start and End Times */}
            <Form.Group className="mb-3" controlId="formStartTime">
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Add a description for the event"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddEventModal;
