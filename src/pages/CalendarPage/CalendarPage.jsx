import Calendar from "../../components/Calendar/Calendar";
import { useEffect, useState } from "react";
import axios from "axios";

function CalendarPage({ accessToken }) {
  const [events, setEvents] = useState([]);
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

        const formattedEvents = response.data.items.map((event) => ({
          id: event.id,
          title: event.summary || "No Title",
          start: event.start?.dateTime || event.start?.date || "Unknown Start",
          end: event.end?.dateTime || event.end?.date || "Unknown End",
          description: event.description || "",
        }));

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
