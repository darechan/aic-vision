import { useState, useEffect } from "react";
import ResourceCard from "../components/ResourceCard";
import api from "../utils/api";

const META = {
  partner: {
    title: "New Partner Resources",
    subtitle: "Everything you need to get started on your journey.",
    tag: "Getting Started",
  },
  "4.0": {
    title: "Resources 4.0",
    subtitle: "Advanced tools and materials for growing IBOs.",
    tag: "Advanced",
  },
  other: {
    title: "Other Resources",
    subtitle: "Additional resources to support your business.",
    tag: "General",
  },
};

export default function Resources({ category }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const meta = META[category] ?? META.other;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/resources/?category=${category}`)
      .then((res) => setResources(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-purple-300 uppercase mb-1">
          {meta.tag}
        </p>
        <h1 className="text-2xl font-bold text-white">{meta.title}</h1>
        <p className="text-purple-400 mt-1 text-sm">{meta.subtitle}</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-purple-700 text-sm">Loading resources…</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-purple-400 text-sm">No resources yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
