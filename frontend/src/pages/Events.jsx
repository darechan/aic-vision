import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import api from "../utils/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/events/")
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-purple-300 uppercase mb-1">
          Calendar
        </p>
        <h1 className="text-2xl font-bold text-white">AIC Events</h1>
        <p className="text-purple-400 mt-1 text-sm">
          Upcoming events from the Vision 20000 community.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-purple-700 text-sm">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-purple-400 text-sm">No upcoming events. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
