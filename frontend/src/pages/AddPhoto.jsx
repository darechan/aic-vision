import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AddPhoto() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const navigate = useNavigate();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError("Please select a photo."); return; }
    if (!title.trim()) { setError("Title is required."); return; }

    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title.trim());
      form.append("description", description.trim());
      await api.post("/api/gallery/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      setError("Upload failed. Please check your connection and try again.");
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-purple-950 transition-colors duration-200">
      {/* Page header */}
      <div className="bg-white dark:bg-purple-900 border-b border-gray-200 dark:border-purple-800 transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg text-gray-500 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-purple-800 transition-colors"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Add Gallery Photo</h1>
            <p className="text-xs text-gray-400 dark:text-purple-500">Upload a photo and fill in the details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-10 space-y-7">

        {/* Photo picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-purple-200 mb-2">
            Photo <span className="text-red-500">*</span>
          </label>

          {preview ? (
            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); URL.revokeObjectURL(preview); }}
                  className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow transition-opacity"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl cursor-pointer bg-white dark:bg-purple-950 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
            >
              <svg className="w-10 h-10 text-purple-300 dark:text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4-4m0 0l4 4m-4-4v9M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
              </svg>
              <p className="text-sm font-medium text-gray-500 dark:text-purple-400">Click or drag & drop to upload</p>
              <p className="text-xs text-gray-400 dark:text-purple-600 mt-1">PNG, JPG, JPEG, GIF, WEBP</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-purple-200 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Conference 2024"
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-purple-700 bg-white dark:bg-purple-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-purple-200 mb-2">
            Description <span className="text-gray-400 dark:text-purple-500 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share some context about this photo…"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-purple-700 bg-white dark:bg-purple-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-purple-700 text-gray-600 dark:text-purple-300 font-medium hover:bg-gray-100 dark:hover:bg-purple-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold shadow transition-colors"
          >
            {uploading ? "Uploading…" : "Submit Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
