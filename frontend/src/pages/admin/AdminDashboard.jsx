import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { logout } from "../../utils/auth";

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition";
const submitCls =
  "bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
const deleteCls =
  "text-xs text-red-500 hover:text-red-700 font-medium px-2.5 py-1 hover:bg-red-50 rounded-lg transition-colors shrink-0";

// ─── Members tab ─────────────────────────────────────────────────────────────
function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    photo_url: "",
    badge_type: "New BBI",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () => api.get("/api/members/").then((r) => setMembers(r.data)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/members/", form);
      setForm({ name: "", location: "", photo_url: "", badge_type: "New BBI" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await api.delete(`/api/members/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-purple-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add Member</h3>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Full name" value={form.name} onChange={set("name")} className={inputCls} />
          <input required placeholder="Location (city, country)" value={form.location} onChange={set("location")} className={inputCls} />
          <input placeholder="Photo URL (optional)" value={form.photo_url} onChange={set("photo_url")} className={inputCls} />
          <select value={form.badge_type} onChange={set("badge_type")} className={inputCls}>
            <option>New BBI</option>
            <option>Requalified BBI</option>
            <option>Founders Platinum</option>
            <option>Emerald</option>
            <option>Diamond</option>
          </select>
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className={submitCls}>
              {loading ? "Adding…" : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Members</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{members.length}</span>
        </div>
        {members.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400 text-center">No members yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-6 py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                  <p className="text-xs text-gray-400 truncate">{m.location} · {m.badge_type}</p>
                </div>
                <button onClick={() => handleDelete(m.id)} className={deleteCls}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Events tab ───────────────────────────────────────────────────────────────
function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () => api.get("/api/events/").then((r) => setEvents(r.data)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/events/", form);
      setForm({ title: "", date: "", location: "", description: "", image_url: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/api/events/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-purple-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add Event</h3>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Event title" value={form.title} onChange={set("title")} className={inputCls} />
          <input required placeholder='Date (e.g. "April 20, 2025")' value={form.date} onChange={set("date")} className={inputCls} />
          <input required placeholder="Location" value={form.location} onChange={set("location")} className={inputCls} />
          <input placeholder="Image URL (optional)" value={form.image_url} onChange={set("image_url")} className={inputCls} />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={set("description")}
            className={`${inputCls} sm:col-span-2 resize-none`}
            rows={3}
          />
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className={submitCls}>
              {loading ? "Adding…" : "Add Event"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Events</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{events.length}</span>
        </div>
        {events.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400 text-center">No events yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-center justify-between px-6 py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400">{ev.date} · {ev.location}</p>
                </div>
                <button onClick={() => handleDelete(ev.id)} className={deleteCls}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Resources tab ────────────────────────────────────────────────────────────
function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    category: "partner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () => api.get("/api/resources/").then((r) => setResources(r.data)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/resources/", form);
      setForm({ title: "", description: "", link: "", category: "partner" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add resource.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await api.delete(`/api/resources/${id}`);
    load();
  };

  const CAT_LABEL = {
    partner: "New Partner",
    "4.0": "Resources 4.0",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-purple-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add Resource</h3>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Resource title" value={form.title} onChange={set("title")} className={inputCls} />
          <select value={form.category} onChange={set("category")} className={inputCls}>
            <option value="partner">New Partner Resources</option>
            <option value="4.0">Resources 4.0</option>
            <option value="other">Other Resources</option>
          </select>
          <input placeholder="Link / URL (optional)" value={form.link} onChange={set("link")} className={`${inputCls} sm:col-span-2`} />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={set("description")}
            className={`${inputCls} sm:col-span-2 resize-none`}
            rows={3}
          />
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className={submitCls}>
              {loading ? "Adding…" : "Add Resource"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Resources</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{resources.length}</span>
        </div>
        {resources.length === 0 ? (
          <p className="px-6 py-10 text-sm text-gray-400 text-center">No resources yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {resources.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-6 py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400">{CAT_LABEL[r.category]} · {r.link || "No link"}</p>
                </div>
                <button onClick={() => handleDelete(r.id)} className={deleteCls}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const TABS = ["Members", "Events", "Resources"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Members");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-950">
      {/* Header */}
      <header className="bg-purple-900 border-b border-purple-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-purple-400 hover:text-purple-200 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to site
            </button>
            <span className="text-purple-700">|</span>
            <h1 className="text-sm font-semibold text-purple-100">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-purple-900 p-1 rounded-2xl w-fit mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-purple-400 hover:text-purple-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Members" && <AdminMembers />}
        {activeTab === "Events" && <AdminEvents />}
        {activeTab === "Resources" && <AdminResources />}
      </div>
    </div>
  );
}
