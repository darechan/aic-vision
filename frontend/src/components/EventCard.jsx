export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {event.image_url && (
        <div className="h-44 overflow-hidden shrink-0">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
            {event.date}
          </span>
          <span className="text-xs text-gray-400">{event.location}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
        )}
      </div>
    </div>
  );
}
