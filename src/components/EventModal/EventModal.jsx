import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { DateTime } from "luxon";

const URL = import.meta.env.VITE_BACKEND_URL;

const EventModal = ({
  show,
  handleClose,
  mode,
  event,
  accessToken,
  refreshEvents,
}) => {
  const initialFormState = {
    title: "",
    isTitleCustom: false,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    attendees: [],
    description: "",
    zoomOption: "none", // options are either: 'none', 'provide', or 'generate'
    zoomLink: "",
    recurringEventId: false,
    isRecurring: false,
    recurrenceDays: [],
    recurrenceEndType: "never",
    recurrenceEndDate: "",
    recurrenceOccurrences: "",
    meetingType: "",
  };

  // Options for events in regards to their reccurance
  // Events either never repeat, repeat up until a certain date, or they reapeat X amount of times
  const recurrenceEndOptions = [
    { value: "never", label: "Never" },
    { value: "date", label: "By Date" },
    { value: "occurrences", label: "After X Occurrences" },
  ];

  // States to keep track of form status and client dropdown list
  const [form, setForm] = useState(initialFormState);
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    if (show) {
      if (mode === "edit" && event) {
        const {
          title,
          start,
          end,
          attendees,
          location,
          description,
          recurringEventId = false,
        } = event;
        // Process recurrence details
        const recurrenceDays =
          event.recurrence?.[0]
            ?.match(/BYDAY=([A-Z,]+)/)?.[1]
            ?.split(",")
            ?.map((day) => {
              const daysMap = {
                SU: "Sunday",
                MO: "Monday",
                TU: "Tuesday",
                WE: "Wednesday",
                TH: "Thursday",
                FR: "Friday",
                SA: "Saturday",
              };
              return daysMap[day];
            }) || [];

        const recurrenceEndType = event.recurrence?.[0]?.includes("UNTIL=")
          ? "date"
          : event.recurrence?.[0]?.includes("COUNT=")
          ? "occurrences"
          : "never";

        const recurrenceEndDate = event.recurrence?.[0]?.match(
          /UNTIL=(\d{8})/
        )?.[1]
          ? `${event.recurrence[0]
              .match(/UNTIL=(\d{8})/)?.[1]
              .slice(0, 4)}-${event.recurrence[0]
              .match(/UNTIL=(\d{8})/)?.[1]
              .slice(4, 6)}-${event.recurrence[0]
              .match(/UNTIL=(\d{8})/)?.[1]
              .slice(6, 8)}`
          : "";

        const recurrenceOccurrences =
          event.recurrence?.[0]?.match(/COUNT=(\d+)/)?.[1] || "";

        // Ensure start and end are parsed from Date objects
        const startDateTime = DateTime.fromJSDate(new Date(start), {
          zone: "America/Toronto",
        });
        const endDateTime = DateTime.fromJSDate(new Date(end), {
          zone: "America/Toronto",
        });

        setForm({
          title: title || "",
          startDate: startDateTime.isValid
            ? startDateTime.toFormat("yyyy-MM-dd")
            : "",
          startTime: startDateTime.isValid
            ? startDateTime.toFormat("HH:mm")
            : "",
          endDate: endDateTime.isValid
            ? endDateTime.toFormat("yyyy-MM-dd")
            : "",
          endTime: endDateTime.isValid ? endDateTime.toFormat("HH:mm") : "",
          attendees: attendees.map((attendee) => ({
            value: attendee.email,
            label: attendee.email,
          })),
          description: description,
          zoomOption: location ? "provide" : "none", // Select "I have a Zoom link" if location exists in the response body
          zoomLink: location || "", // Populate the input with the Zoom link ONLY if it exists
          isRecurring: !!recurringEventId,
          recurrenceDays,
          recurrenceEndDate,
          recurrenceOccurrences,
          recurrenceEndType,
        });
      } else {
        setForm(initialFormState);
      }
    }
  }, [show, mode, event]);

  // Helper function to calculate end time and make sure when i send it back to google and zoom that its in UTC
  const calculateEndTime = (startDate, startTime, durationMinutes) => {
    if (!startDate || !startTime || durationMinutes <= 0) return "";

    const startDateTime = DateTime.fromISO(`${startDate}T${startTime}`, {
      zone: "America/Toronto",
    });

    if (!startDateTime.isValid) return "";

    const endDateTime = startDateTime.plus({ minutes: durationMinutes });
    return endDateTime.toFormat("HH:mm");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "title" && { isTitleCustom: true }),
      };

      const validateInput = (value, format, zone = "America/Toronto") => {
        if (!value) return "";
        const dt = DateTime.fromISO(value, { zone });
        return dt.isValid ? dt.toFormat(format) : "";
      };

      // Validate the time and date
      if (name === "startDate" || name === "endDate") {
        updatedForm[name] = validateInput(value, "yyyy-MM-dd");
      }
      if (name === "startTime" || name === "endTime") {
        updatedForm[name] = validateInput(value, "HH:mm");
      }

      // Update title dynamically if the meeting type changes
      if (name === "meetingType" && value === "trial" && !prev.isTitleCustom) {
        updatedForm.title = `SparkWise Trial Lesson${
          prev.attendees.length > 0 &&
          prev.attendees[0]?.first_name &&
          prev.attendees[0]?.last_name &&
          prev.attendees[0]?.phone
            ? ` for ${prev.attendees[0].first_name} ${prev.attendees[0].last_name} (${prev.attendees[0].phone})`
            : ""
        }`;
      }

      const durationMinutes =
        updatedForm.meetingType === "trial"
          ? 30
          : updatedForm.meetingType === "class"
          ? 60
          : 0;

      // Handle changes in start time or start date
      if (
        (name === "startTime" || name === "startDate") &&
        durationMinutes > 0
      ) {
        const newEndTime = calculateEndTime(
          updatedForm.startDate || prev.startDate,
          updatedForm.startTime || prev.startTime,
          durationMinutes
        );

        if (newEndTime) {
          updatedForm.endDate = updatedForm.startDate || prev.startDate;
          updatedForm.endTime = newEndTime;
        } else {
          // Clear invalid values
          updatedForm.endDate = "";
          updatedForm.endTime = "";
        }
      }

      // Handle changes in meeting type
      if (name === "meetingType" && durationMinutes > 0) {
        const newEndTime = calculateEndTime(
          prev.startDate,
          prev.startTime,
          durationMinutes
        );

        if (newEndTime) {
          updatedForm.endDate = prev.startDate;
          updatedForm.endTime = newEndTime;
        } else {
          // Clear invalid values
          updatedForm.endDate = "";
          updatedForm.endTime = "";
        }
      }

      return updatedForm;
    });
  };

  // This handles the date changes for recurring events
  const handleRecurrenceDayChange = (day) => {
    setForm((prev) => {
      const days = prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter((d) => d !== day)
        : [...prev.recurrenceDays, day];
      return { ...prev, recurrenceDays: days };
    });
  };

  // This handles changes to the end date for recurring events
  const handleRecurrenceEndChange = (selectedOption) => {
    setForm((prev) => ({ ...prev, recurrenceEndType: selectedOption.value }));
  };

  // This is for adding attendees, the input automatically populates using the client db
  const fetchClientSuggestions = async (inputValue) => {
    if (!inputValue) {
      // Clear options when input is empty
      setClientOptions([]);
      return;
    }
    try {
      // Only get 10 options at a time otherwise, its too much
      const response = await axios.get(`${URL}/clients`, {
        params: { search: inputValue, limit: 10 },
      });
      const options = response.data.map((client) => ({
        value: client.parent_email,
        label: `${client.parent_first_name} ${client.parent_last_name} (${client.parent_email})`,
        first_name: client.parent_first_name,
        last_name: client.parent_last_name,
        email: client.parent_email,
        phone: client.parent_phone,
      }));
      setClientOptions(options);
    } catch (error) {
      console.error("Error fetching client suggestions:", error);
    }
  };

  // This is a helper function to calculate the duration of an event
  const calculateDuration = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    return Math.ceil((end - start) / (1000 * 60));
  };

  // Generate a zoom link only if the user checks the box
  const generateZoomLink = async () => {
    try {
      const attendees = form.attendees.map((attendee) => ({
        // Email is in the `value` field from react-select
        email: attendee.value,
        // If the full name isnt found just use defaults
        first_name: attendee.first_name || "Guest",
        last_name: attendee.last_name || "User",
      }));

      const meetingRequest = {
        topic: form.title,
        start_time: `${form.startDate}T${form.startTime}:00`,
        duration: calculateDuration(
          `${form.startDate}T${form.startTime}:00`,
          `${form.endDate}T${form.endTime}:00`
        ),
        type: 8, // A meeting with type 8 is a recurring meeting with fixed time
        settings: {
          host_video: true,
          participant_video: true,
          waiting_room: true,
          approval_type: 0, // Automatic approval so that clients get notifications
        },
      };

      // Add recurrence logic based on user input
      if (form.isRecurring) {
        meetingRequest.recurrence = {
          type: 2, // A meeting with type 2 has weekly recurrence (which by default is the only type we want - perhaps I will implement new logic in the future)
          repeat_interval: 1, // For meetings with type 2, a repeat interval of 1 means repeat every week
          weekly_days: form.recurrenceDays
            .map((day) => ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][day])
            .join(","),
          ...(form.recurrenceEndType === "date"
            ? { end_date_time: `${form.recurrenceEndDate}T23:59:59Z` }
            : form.recurrenceEndType === "occurrences"
            ? { end_times: parseInt(form.recurrenceOccurrences, 10) }
            : {}),
        };
      }

      // Once the form is all formatted, send it to the backend to generate a zoom link
      const response = await axios.post(
        `${URL}/calendar/create-zoom-meeting`,
        meetingRequest
      );

      return response.data.join_url;
    } catch (error) {
      console.error("Error generating Zoom link:", error);
      toast.error("Failed to generate Zoom link. Please try again.");
      throw error;
    }
  };

  // This handles saving an event
  const handleSave = async () => {
    try {
      // The minimum an event needs is a title, start and end date and times
      if (
        !form.title ||
        !form.startDate ||
        !form.startTime ||
        !form.endDate ||
        !form.endTime
      ) {
        toast.error("Please fill out all required fields.");
        return;
      }

      // If a user selected generate zoom link, get one from the backend
      let zoomLink = form.zoomLink;
      if (form.zoomOption === "generate") {
        zoomLink = await generateZoomLink();
      }

      const startDateTime = DateTime.fromISO(
        `${form.startDate}T${form.startTime}`,
        { zone: "America/Toronto" }
      )
        .toUTC()
        .toISO();

      const endDateTime = DateTime.fromISO(`${form.endDate}T${form.endTime}`, {
        zone: "America/Toronto",
      })
        .toUTC()
        .toISO();

      // This will populate the recurrance rules which will be sent to the backend
      const recurrenceRules = [];
      if (form.isRecurring) {
        const daysOfWeek = form.recurrenceDays
          .map(
            (day) =>
              ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][
                [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].indexOf(day)
              ]
          )
          .join(",");

        if (form.recurrenceEndType === "date" && form.recurrenceEndDate) {
          recurrenceRules.push(
            `RRULE:FREQ=WEEKLY;BYDAY=${daysOfWeek};UNTIL=${DateTime.fromISO(
              form.recurrenceEndDate,
              { zone: "America/Toronto" }
            )
              .toUTC()
              .toFormat("yyyyMMdd'T'HHmmss'Z'")}`
          );
        } else if (
          form.recurrenceEndType === "occurrences" &&
          form.recurrenceOccurrences
        ) {
          // Repeat for a specific number of occurrences
          recurrenceRules.push(
            `RRULE:FREQ=WEEKLY;BYDAY=${daysOfWeek};COUNT=${form.recurrenceOccurrences}`
          );
        } else {
          // Never-ending (Google Calendar and zoom will cap this automatically to 60?)
          recurrenceRules.push(`RRULE:FREQ=WEEKLY;BYDAY=${daysOfWeek}`);
        }
      }

      // This formats all the attendess to send to the backend
      const attendees =
        form.attendees.length === 0
          ? []
          : form.attendees.map((attendee) => ({
              email: attendee.value,
            }));

      const calendarEvent = {
        summary: form.title,
        location: zoomLink || "",
        description: form.description || "",

        start: {
          dateTime: startDateTime,
          timeZone: "America/Toronto",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "America/Toronto",
        },
        attendees,
        recurrence: recurrenceRules.length > 0 ? recurrenceRules : undefined, // Add recurrence only if applicable
      };

      // If the user is choosing to ADD an event, then do a POST, else do a PATCH
      if (mode === "add") {
        await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
          calendarEvent,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { sendUpdates: "all" },
          }
        );
        toast.success("Event created successfully!");
      } else {
        await axios.patch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`,
          calendarEvent,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { sendUpdates: "all" },
          }
        );
        toast.success("Event updated successfully!");
      }

      refreshEvents();
      handleClose();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event.");
    }
  };

  // Dynamically populates options based on user input (in the text field)
  const handleAttendeeChange = (selectedOptions) => {
    setForm((prev) => {
      const updatedForm = {
        ...prev,
        attendees: selectedOptions || [], // Save the selected attendees
      };

      // Update the title only if it hasn't been manually customized
      if (!prev.isTitleCustom && prev.meetingType === "trial") {
        updatedForm.title = `SparkWise Trial Lesson${
          selectedOptions.length > 0 &&
          selectedOptions[0]?.first_name &&
          selectedOptions[0]?.last_name &&
          selectedOptions[0]?.phone
            ? ` for ${selectedOptions[0].first_name} ${selectedOptions[0].last_name} (${selectedOptions[0].phone})`
            : ""
        }`;
      }

      return updatedForm;
    });
  };

  // This one, updates the forms attendees field when the user selects an option from those suggestions
  const handleAttendeeInputChange = (inputValue) => {
    fetchClientSuggestions(inputValue); // Fetch client suggestions
    return inputValue; // Ensure react-select gets the input value for display
  };

  // This function handles deleting existing events (either single or recurring)
  const handleDelete = async (deleteType) => {
    try {
      let url;
      if (deleteType === "single") {
        // Delete only this instance of the recurring event
        url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.id}`;
      } else if (deleteType === "series") {
        // Delete the entire series of recurring events
        url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.recurringEventId}`;
      }

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success(
        deleteType === "single"
          ? "Successfully deleted this event."
          : "Successfully deleted all events in the series."
      );

      refreshEvents();
      handleClose();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{mode === "add" ? "Add Event" : "Edit Event"}</Modal.Title>
        <IoClose onClick={handleClose} className="close-btn" />
      </Modal.Header>
      <Modal.Body style={{ fontSize: "0.85rem" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Event Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={
                form.isTitleCustom
                  ? form.title // Only want to keep the title if edited otherwise use the generated one
                  : form.meetingType === "trial"
                  ? `SparkWise Trial Lesson${
                      form.attendees.length > 0 &&
                      form.attendees[0]?.first_name &&
                      form.attendees[0]?.last_name &&
                      form.attendees[0]?.phone
                        ? ` for ${form.attendees[0].first_name} ${form.attendees[0].last_name} (${form.attendees[0].phone})`
                        : ""
                    }`
                  : form.title
              }
              onChange={handleInputChange}
              placeholder="Enter event title"
            />
          </Form.Group>
          {/* Type of event - either none (regualar), trial lesson (30 minutes), class (duration 1 hour) */}
          {mode == "add" && (
            <Form.Group className="mb-3">
              <Form.Label>Type of Meeting: </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  label="Trial Lesson (30 minutes)"
                  name="meetingType"
                  value="trial"
                  onChange={handleInputChange}
                  checked={form.meetingType === "trial"}
                  inline
                  disabled={mode === "edit"}
                />
                <Form.Check
                  type="radio"
                  label="Class (1 hour)"
                  name="meetingType"
                  value="class"
                  onChange={handleInputChange}
                  checked={form.meetingType === "class"}
                  inline
                  disabled={mode === "edit"}
                />
                <Form.Check
                  type="radio"
                  label="Other"
                  name="meetingType"
                  value="other"
                  onChange={handleInputChange}
                  checked={form.meetingType === "other"}
                  inline
                  disabled={mode === "edit"}
                />
              </div>
            </Form.Group>
          )}

          {(form.meetingType || mode == "edit") && (
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate || ""}
                    onChange={handleInputChange}
                    disabled={
                      form.meetingType == "trial" || form.meetingType == "class"
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={form.endTime || ""}
                    onChange={handleInputChange}
                    disabled={
                      form.meetingType == "trial" || form.meetingType == "class"
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Attendees</Form.Label>
            <Select
              isMulti
              value={form.attendees}
              onChange={handleAttendeeChange}
              onInputChange={handleAttendeeInputChange}
              options={clientOptions}
              placeholder="Type to search for clients..."
              noOptionsMessage={() => "No clients found"}
            />
          </Form.Group>
          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Additional Notes (visibile to clients)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={form.description}
              onChange={handleInputChange}
              style={{ padding: "0.25rem", fontSize: "0.85rem" }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Zoom Link Options: </Form.Label>
            <div className="d-flex align-items-center">
              <Form.Check
                type="radio"
                label="No Zoom link needed"
                name="zoomOption"
                value="none"
                checked={form.zoomOption === "none"}
                onChange={handleInputChange}
                inline
                disabled={
                  mode === "edit" && form.zoomLink && form.zoomLink.length > 0
                }
              />
              <Form.Check
                type="radio"
                label="I have a Zoom link"
                name="zoomOption"
                value="provide"
                checked={form.zoomOption === "provide"}
                onChange={handleInputChange}
                inline
              />
              <Form.Check
                type="radio"
                label="Generate a Zoom link for me"
                name="zoomOption"
                value="generate"
                checked={form.zoomOption === "generate"}
                onChange={handleInputChange}
                inline
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            {form.zoomOption === "provide" && (
              <Form.Control
                type="url"
                name="zoomLink"
                value={form.zoomLink}
                onChange={handleInputChange}
                placeholder="Paste your Zoom link here"
              />
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isRecurring"
              label="Recurring Meeting"
              checked={form.isRecurring}
              onChange={handleInputChange}
              disabled={mode === "edit" || form.meetingType == "trial"}
            />
          </Form.Group>
          {form.isRecurring && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Occurs On:</Form.Label>
                <div className="d-flex flex-wrap">
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day) => (
                    <Form.Check
                      key={day}
                      type="checkbox"
                      label={day}
                      checked={form.recurrenceDays.includes(day)}
                      onChange={() => handleRecurrenceDayChange(day)}
                      inline
                      disabled={mode === "edit" && form.isRecurring}
                    />
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Recurrence</Form.Label>
                <Select
                  isDisabled={mode === "edit" && form.isRecurring}
                  options={recurrenceEndOptions}
                  value={recurrenceEndOptions.find(
                    (option) => option.value === form.recurrenceEndType
                  )}
                  onChange={handleRecurrenceEndChange}
                  placeholder="Select end type"
                />
              </Form.Group>
              {form.recurrenceEndType === "date" && (
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="recurrenceEndDate"
                    value={form.recurrenceEndDate}
                    onChange={handleInputChange}
                    disabled={mode === "edit" && form.isRecurring}
                  />
                </Form.Group>
              )}
              {form.recurrenceEndType === "occurrences" && (
                <Form.Group className="mb-3">
                  <Form.Label>Occurrences</Form.Label>
                  <Form.Control
                    type="number"
                    name="recurrenceOccurrences"
                    value={form.recurrenceOccurrences}
                    onChange={handleInputChange}
                    min="1"
                    disabled={mode === "edit" && form.isRecurring}
                  />
                </Form.Group>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          {mode === "edit" && form.isRecurring && (
            <Button
              variant="danger"
              onClick={() => handleDelete("series")}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                marginRight: "10px",
              }}
            >
              Delete All Events In Series
            </Button>
          )}
          {mode === "edit" && (
            <Button
              variant="danger"
              onClick={() => handleDelete("single")}
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              Delete This Single Event
            </Button>
          )}
        </div>
        <div>
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            {mode === "add" ? "Add Event" : "Save Changes"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
