import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Calendar.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import EventModal from "../EventModal/EventModal";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Calendar() {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("Month");
  const [calendarTitle, setCalendarTitle] = useState("");

  async function getEvents() {
    try {
      const { data } = await axios.get(`${BASE_URL}/calendar`);
      const formattedEvents = data.map((event) => ({
        id: event.id,
        title: event.summary || "Untitled Event",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "",
        allDay: !event.start?.dateTime,
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
    setCalendarTitle(calendarApi.view.title);
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCalendarTitle(calendarApi.view.title);
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCalendarTitle(calendarApi.view.title);
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
    setCalendarTitle(calendarApi.view.title);
  };

  // Update title when dates change
  const handleDatesSet = (dateInfo) => {
    setCalendarTitle(dateInfo.view.title);
  };

  return (
    <div className="calendar-container">
      <div className="custom-toolbar">
        <button className="today-button" onClick={handleToday}>
          Today
        </button>
        <div className="toolbar-center">
          <div className="navigation">
            <button className="nav-button" onClick={handlePrev}>
              <FaArrowLeft />
            </button>
            <span className="calendar-title">
              {calendarTitle || "Loading..."}
            </span>
            <button className="nav-button" onClick={handleNext}>
              <FaArrowRight />
            </button>
          </div>
          <div className="view-buttons">
            <button
              className={`view-button ${
                currentView === "Month" ? "active" : ""
              }`}
              onClick={() => handleViewChange("dayGridMonth")}
            >
              Month
            </button>
            <button
              className={`view-button ${
                currentView === "Week" ? "active" : ""
              }`}
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
        </div>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={events}
        datesSet={handleDatesSet}
        views={{
          timeGridWeek: {
            nowIndicator: true,
            allDaySlot: false,
            slotLabelFormat: {
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: true,
            },
            expandRows: true,
            scrollTime: "08:00:00",
          },
          timeGridDay: {
            nowIndicator: true,
            allDaySlot: false,
            slotLabelFormat: {
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: true,
            },
            scrollTime: "08:00:00",
          },
        }}
      />
    </div>
  );
}

export default Calendar;
