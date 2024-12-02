import Calendar from "../../components/Calendar/Calendar";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CalendarPage.scss";

function CalendarPage({ accessToken }) {
  const [events, setEvents] = useState([]);

  // Fetch recurrence details for multiple recurring events
  const fetchBatchRecurrenceDetails = async (recurringEventIds) => {
    try {
      const responses = await Promise.all(
        recurringEventIds.map((id) =>
          axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
        )
      );
      return responses.reduce((acc, response, index) => {
        acc[recurringEventIds[index]] = response.data.recurrence || [];
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching batch recurrence details:", error);
      return {};
    }
  };

  const fetchEvents = async () => {
    let allEvents = [];
    let nextPageToken = null;

    try {
      do {
        const response = await axios.get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              maxResults: 250,
              pageToken: nextPageToken,
              singleEvents: true,
              orderBy: "startTime",
            },
          }
        );

        console.log("this is the regular response", response);

        // Separate events that require recurrence details
        const eventsRequiringRecurrence = response.data.items.filter(
          (event) => event.recurringEventId && !event.recurrence
        );

        // Extract unique recurringEventIds
        const recurringEventIds = [
          ...new Set(eventsRequiringRecurrence.map((e) => e.recurringEventId)),
        ];

        // Fetch recurrence details in batch
        const recurrenceDetails = await fetchBatchRecurrenceDetails(
          recurringEventIds
        );

        // Format all events
        const formattedEvents = response.data.items.map((event) => ({
          id: event.id,
          title: event.summary || "No Title",
          start: event.start?.dateTime || event.start?.date || "Unknown Start",
          end: event.end?.dateTime || event.end?.date || "Unknown End",
          description: event.description || "",
          attendees: event.attendees || [],
          recurringEventId: event.recurringEventId || false,
          location: event.location || "",
          recurrence:
            event.recurrence || recurrenceDetails[event.recurringEventId] || [], // Use fetched recurrence if needed
        }));

        console.log("this is the formatted response", formattedEvents);

        allEvents = [...allEvents, ...formattedEvents];
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);

      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  return (
    <>
      <div className="main-container content">
        <Calendar
          events={events}
          accessToken={accessToken}
          refreshEvents={fetchEvents}
        />
      </div>
    </>
  );
}

export default CalendarPage;
