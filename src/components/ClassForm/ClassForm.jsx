import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import WarningModal from "../WarningModal/WarningModal";
const DEFAULT_CLASS_DURATION_MINUTES = 60;

function ClassForm({
  mode = "create",
  initialData = {},
  onSubmit,
  onCancel,
  classTypeOptions = [],
  teacherOptions = [],
  studentOptions = [],
  daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
}) {
  const [form, setForm] = useState({
    class_type_id: "",
    teacher_id: "",
    schedule: [],
    start_date: "",
    occurrences: "",
    zoomLink: "",
    googleClassroomCode: "",
    internalNotes: "",
    zoomOption: "none",
    students: [],
  });

  // Which days are selected?
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (mode === "edit" && initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({
        ...prev,
        class_type_id: initialData.class_type_id || "",
        teacher_id: initialData.teacher_id || "",
        schedule: initialData.schedule || [],
        start_date: initialData.start_date
          ? initialData.start_date.split("T")[0]
          : "",
        occurrences: initialData.occurrences || "",
        zoomLink: initialData.zoom_link || "",
        googleClassroomCode: initialData.google_classroom_code || "",
        internalNotes: initialData.internal_notes || "",
        zoomOption: initialData.zoom_link ? "provide" : "none",
        students: Array.isArray(initialData.students)
          ? initialData.students.map((s) => ({
              value: s.value ?? s.id,
              label: s.label || `${s.first_name} ${s.last_name}`,
            }))
          : [],
      }));

      if (Array.isArray(initialData.schedule)) {
        setSelectedDays(initialData.schedule.map((slot) => slot.day));

        // Set start and end times correctly
        const scheduleObj = {};
        initialData.schedule.forEach((slot) => {
          scheduleObj[`start_time_${slot.day}`] = slot.start_time || "";
          scheduleObj[`end_time_${slot.day}`] = slot.end_time || "";
        });

        setForm((prev) => ({
          ...prev,
          ...scheduleObj,
        }));
      }
    }
  }, [mode, initialData]);

  // handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user picks a start_time_{day}, auto-set end_time_{day}
    if (name.startsWith("start_time_")) {
      const day = name.replace("start_time_", "");
      if (value) {
        const [startHour, startMin] = value.split(":").map(Number);
        const endDate = new Date();
        endDate.setHours(startHour);
        endDate.setMinutes(startMin + DEFAULT_CLASS_DURATION_MINUTES);

        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
        const newEndTime = `${endHours}:${endMinutes}`;

        setForm((prev) => ({
          ...prev,
          [name]: value,
          [`end_time_${day}`]: newEndTime,
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // toggling days
  const handleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // On Save
  const handleSave = () => {
    // build schedule
    const schedule = selectedDays.map((day) => ({
      day,
      start_time: form[`start_time_${day}`] || "00:00",
      end_time: form[`end_time_${day}`] || "00:00",
    }));

    const payload = {
      class_type_id: form.class_type_id,
      teacher_id: form.teacher_id,
      start_date: form.start_date,
      occurrences: form.occurrences,
      schedule,
      zoom_link: form.zoomLink,
      google_classroom_code: form.googleClassroomCode,
      internal_notes: form.internalNotes,
      // student IDs
      students: form.students.map((s) => s.value ?? s),
    };

    onSubmit(payload);
  };

  return (
    <>
      <Form>
        {/* Class Type + Teacher */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Class Type</Form.Label>
              <Select
                options={classTypeOptions}
                value={
                  classTypeOptions.find(
                    (opt) => opt.value === form.class_type_id
                  ) || null
                }
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    class_type_id: selected.value,
                  }))
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Teacher</Form.Label>
              <Select
                options={teacherOptions}
                value={
                  teacherOptions.find((opt) => opt.value === form.teacher_id) ||
                  null
                }
                onChange={(selected) =>
                  setForm((prev) => ({ ...prev, teacher_id: selected.value }))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Start Date + Occurrences */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                disabled={mode === "edit"}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Occurrences</Form.Label>
              <Form.Control
                type="number"
                name="occurrences"
                value={form.occurrences}
                onChange={handleChange}
                min="1"
                disabled={mode === "edit"}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Days of the Week */}
        <Form.Group className="mb-3">
          <Form.Label>Days of the Week</Form.Label>
          <div className="days-container">
            {daysOfWeek.map((day) => (
              <Form.Check
                key={day}
                label={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDaySelection(day)}
                disabled={mode === "edit"}
              />
            ))}
          </div>
        </Form.Group>

        {/* Time pickers for selected days */}
        {selectedDays.map((day) => (
          <Row key={day} className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{day} Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name={`start_time_${day}`}
                  value={form[`start_time_${day}`] || ""}
                  onChange={handleChange}
                  disabled={mode === "edit"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{day} End Time</Form.Label>
                <Form.Control
                  type="time"
                  name={`end_time_${day}`}
                  value={form[`end_time_${day}`] || ""}
                  onChange={handleChange}
                  disabled={mode === "edit"}
                />
              </Form.Group>
            </Col>
          </Row>
        ))}

        {/* Students Multi-Select */}
        <Form.Group className="mb-3">
          <Form.Label>Students</Form.Label>
          <Select
            isMulti
            options={studentOptions}
            value={form.students}
            onChange={(selectedOpts) =>
              setForm((prev) => ({ ...prev, students: selectedOpts }))
            }
          />
        </Form.Group>

        {/* Google Classroom Code */}
        <Form.Group className="mb-3">
          <Form.Label>Google Classroom Code</Form.Label>
          <Form.Control
            type="text"
            name="googleClassroomCode"
            value={form.googleClassroomCode}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Zoom Link Options */}
        <Form.Group className="mb-3">
          <Form.Label>Zoom Link Options</Form.Label>
          <div className="radio-group">
            <Form.Check
              type="radio"
              label="No Zoom link needed"
              name="zoomOption"
              value="none"
              checked={form.zoomOption === "none"}
              onChange={handleChange}
              disabled={mode === "edit"}
              inline
            />
            <Form.Check
              type="radio"
              label="I have a Zoom link"
              name="zoomOption"
              value="provide"
              checked={form.zoomOption === "provide"}
              onChange={handleChange}
              disabled={mode === "edit"}
              inline
            />
            <Form.Check
              type="radio"
              label="Generate a Zoom link for me"
              name="zoomOption"
              value="generate"
              checked={form.zoomOption === "generate"}
              onChange={handleChange}
              disabled={mode === "edit"}
              inline
            />
          </div>
        </Form.Group>
        {form.zoomOption === "provide" && (
          <Form.Group className="mb-3">
            <Form.Control
              type="url"
              name="zoomLink"
              value={form.zoomLink}
              onChange={handleChange}
              placeholder="Paste your Zoom link here"
              disabled={mode === "edit"}
            />
          </Form.Group>
        )}

        {/* Internal Notes */}
        <Form.Group className="mb-3">
          <Form.Label>Internal Notes</Form.Label>
          <Form.Control
            as="textarea"
            name="internalNotes"
            value={form.internalNotes}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        {/* Buttons */}
        <div className="actions-footer">
          <Button variant="secondary" onClick={onCancel}>
            {mode === "edit" ? "Cancel Edit" : "Cancel"}
          </Button>

          <Button variant="primary" onClick={handleSave}>
            {mode === "edit" ? "Save Changes" : "Save Class"}
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ClassForm;
