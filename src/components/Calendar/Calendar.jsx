import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Calendar.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Calendar() {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null); // Reference for FullCalendar instance
  const [currentView, setCurrentView] = useState("Month"); // Track current view
  const [calendarTitle, setCalendarTitle] = useState(""); // Dynamic title state

  async function getEvents() {
    try {
      const { data } = await axios.get(`${BASE_URL}/calendar`);
      const formattedEvents = data.map((event) => ({
        id: event.id,
        title: event.summary || "Untitled Event", // Fallback for missing titles
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "",
        allDay: !event.start?.dateTime, // If no time is specified, mark it as all-day
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEvents();
  }, []);

  // Navigate Calendar
  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCalendarTitle(calendarApi.view.title); // Update title after navigation
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCalendarTitle(calendarApi.view.title); // Update title after navigation
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCalendarTitle(calendarApi.view.title); // Update title after navigation
  };

  // Change Calendar View
  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
    setCurrentView(
      view === "dayGridMonth"
        ? "Month"
        : view === "timeGridWeek"
        ? "Week"
        : "Day"
    );
    setCalendarTitle(calendarApi.view.title); // Update title when view changes
  };

  // Update title when dates change (e.g., navigation or view switch)
  const handleDatesSet = (dateInfo) => {
    setCalendarTitle(dateInfo.view.title);
  };

  return (
    <div className="calendar-container">
      {/* Today Button */}
      <button className="today-button" onClick={handleToday}>
        Today
      </button>
      <div className="custom-toolbar">
        {/* Custom Toolbar */}
        {/* Navigation Buttons */}
        <button className="nav-button" onClick={handlePrev}>
          <FaArrowLeft />
        </button>
        {/* Calendar Title */}
        <span className="calendar-title">{calendarTitle || "Loading..."}</span>
        <button className="nav-button" onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>
      {/* View Buttons */}
      <div className="view-buttons">
        <button
          className={`view-button ${currentView === "Month" ? "active" : ""}`}
          onClick={() => handleViewChange("dayGridMonth")}
        >
          Month
        </button>
        <button
          className={`view-button ${currentView === "Week" ? "active" : ""}`}
          onClick={() => handleViewChange("timeGridWeek")}
        >
          Week
        </button>
        <button
          className={`view-button ${currentView === "Day" ? "active" : ""}`}
          onClick={() => handleViewChange("timeGridDay")}
        >
          Day
        </button>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false} // Disable default toolbar
        events={events}
        datesSet={handleDatesSet} // Update title dynamically when dates change
      />
    </div>
  );
}

export default Calendar;
