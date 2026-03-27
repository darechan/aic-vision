const BADGE_COLORS = {
  "New BBI": "bg-blue-600",
  "Requalified BBI": "bg-emerald-600",
  "Founders Platinum": "bg-indigo-600",
  Emerald: "bg-teal-600",
  Diamond: "bg-cyan-700",
};

function badgeColor(type) {
  return BADGE_COLORS[type] ?? "bg-gray-600";
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MemberCard({ member }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar with badge overlay */}
      <div className="relative mb-5">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-purple-100">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-50 flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">{initials(member.name)}</span>
            </div>
          )}
        </div>
        {/* Badge pill overlapping bottom of circle */}
        <span
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 ${badgeColor(member.badge_type)} text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm`}
        >
          {member.badge_type}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm mt-1">{member.name}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{member.location}</p>
    </div>
  );
}
