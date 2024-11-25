import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { IoClose } from "react-icons/io5";
import "./EventModal.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EventModal({ show, handleClose, event, accessToken, refreshEvents }) {
  const [form, setForm] = useState({
    summary: "",
    description: "",
    start: "",
    end: "",
  });

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Populate state when the `event` prop changes
  useEffect(() => {
    if (event) {

      // Use the correct property names based on your event object
      const startDateTime = event.start;
      const endDateTime = event.end;

      setForm({
        summary: event.title || "",
        description: event.description || "",
        start: startDateTime,
        end: endDateTime,
      });

      setStartDate(convertToDateInputFormat(startDateTime));
      setStartTime(convertToTimeInputFormat(startDateTime));
      setEndTime(convertToTimeInputFormat(endDateTime));
    }
  }, [event]);

  const convertToDateInputFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertToTimeInputFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!startDate || !startTime || !endTime) {
        toast.error("Please enter valid start and end dates and times.");
        return;
      }
      // Construct the correct dateTime strings
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${startDate}T${endTime}`).toISOString();

      // Construct the correct payload
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

      await axios.patch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success("Event has been updated successfully!");
      refreshEvents(); // Refresh events
      handleClose(); // Close modal
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to update the event. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("Event deleted successfully!");
      refreshEvents(); // Refresh the events on the calendar
      handleClose(); // Close the modal
    } catch (error) {
      console.error(
        "Error deleting event:",
        error.response?.data || error.message
      );
      toast.error("Error deleting event. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Event Details</Modal.Title>
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
        <Button variant="danger" onClick={handleDelete}>
          Delete Event
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export default EventModal;
