import { useState, useEffect } from "react";
import MemberCard from "../components/MemberCard";
import api from "../utils/api";

export default function Leadership() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/members/")
      .then((res) => setMembers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-purple-500 dark:text-purple-300 uppercase mb-1">
          Our Team
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leadership</h1>
        <p className="text-gray-500 dark:text-purple-400 mt-1 text-sm">
          Meet the dedicated leaders of Vision 20000.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 dark:text-purple-700 text-sm">Loading members…</div>
      ) : members.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 dark:text-purple-400 text-sm">No leadership members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}
