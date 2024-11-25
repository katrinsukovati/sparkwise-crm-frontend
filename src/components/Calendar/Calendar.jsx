import { useState, useRef } from "react";
import "./Calendar.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import EventModal from "../EventModal/EventModal";

function Calendar({ events, refreshEvents, accessToken }) {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("Month");
  const [calendarTitle, setCalendarTitle] = useState("");

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Navigation handlers
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

  const handleDatesSet = (dateInfo) => {
    setCalendarTitle(dateInfo.view.title);
  };

  // Event click handler
  const handleEventClick = (info) => {
    const clickedEvent = {
      id: info.event.id,
      title: info.event.title || "Untitled Event",
      start: info.event.start || "No start time",
      end: info.event.end || "No end time",
      description: info.event.extendedProps.description || "No description",
      allDay: info.event.allDay,
    };
    setSelectedEvent(clickedEvent);
    setShowEventModal(true);
  };

  return (
    <div className="calendar-container content">
      <div className="custom-toolbar">
        <div className="toolbar-center">
          <div className="navigation">
            <div>
              <button className="navigation__btn" onClick={handleToday}>
                Today
              </button>
            </div>
            <div>
              {" "}
              <div className="navigation__title">
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
                  className={`view-button ${
                    currentView === "Day" ? "active" : ""
                  }`}
                  onClick={() => handleViewChange("timeGridDay")}
                >
                  Day
                </button>
              </div>
            </div>

            <div>
              <button className="navigation__btn">Add Event</button>
            </div>
          </div>
        </div>
      </div>

      <FullCalendar
        eventClick={handleEventClick}
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
      <EventModal
        show={showEventModal}
        handleClose={() => setShowEventModal(false)}
        event={selectedEvent}
        accessToken={accessToken}
        refreshEvents={refreshEvents}
      />
    </div>
  );
}

export default Calendar;
