import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const API_BASE = "http://localhost:5000";

// Card width + gap must match so scrollBy lands on a card boundary
const CARD_W = 220; // px  (matches w-[220px] below)
const CARD_GAP = 16; // px (matches gap-4)
const SCROLL_STEP = CARD_W + CARD_GAP;

function GalleryCarousel({ photos }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  function scrollLeft() {
    rowRef.current?.scrollBy({ left: -SCROLL_STEP * 2, behavior: "smooth" });
  }
  function scrollRight() {
    rowRef.current?.scrollBy({ left: SCROLL_STEP * 2, behavior: "smooth" });
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">📸</div>
        <p className="text-base font-medium text-gray-600 dark:text-purple-300 mb-1">
          No qualifier photos yet
        </p>
        <p className="text-sm text-gray-400 dark:text-purple-500 mb-5">
          Be the first to add one!
        </p>
        <button
          onClick={() => navigate("/gallery/add")}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow transition-colors"
        >
          Add First Photo
        </button>
      </div>
    );
  }

  return (
    /* Outer wrapper: relative so arrow buttons can be positioned against it.
       overflow-visible so the arrows aren't clipped. */
    <div className="relative">
      {/* ── Left arrow ── */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll left"
        className="absolute -left-5 top-[45%] -translate-y-1/2 z-10
                   w-10 h-10 flex items-center justify-center
                   rounded-full bg-white dark:bg-purple-800 shadow-md
                   text-gray-600 dark:text-white
                   hover:bg-purple-50 dark:hover:bg-purple-700
                   border border-gray-100 dark:border-purple-700
                   transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* ── Scrollable card row ──
          - flex: places cards in a horizontal row
          - overflow-x-auto: enables horizontal scroll
          - snap-x snap-mandatory: CSS scroll-snap locks scroll to card starts
          - no-scrollbar: hides the native scrollbar (styled in index.css)
          - px-1 pb-3: a sliver of padding so card shadows aren't clipped  */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar px-1 pb-3"
      >
        {photos.map((photo) => (
          /* Each card:
             - flex-shrink-0: prevents flex from squishing the card
             - w-[220px]: fixed card width — NEVER grows to fill the row
             - snap-start: snaps to the left edge of this card on scroll  */
          <article
            key={photo.id}
            className="flex-shrink-0 w-[220px] snap-start
                       rounded-2xl overflow-hidden
                       bg-white dark:bg-purple-900
                       border border-gray-100 dark:border-purple-800
                       shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image area:
                - aspect-[3/4]: portrait card ratio (220 × 293 px)
                - overflow-hidden: clips the image to the card shape
                - relative: needed for the overlay div  */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-purple-950">
              <img
                src={`${API_BASE}${photo.url}`}
                alt={photo.title || "Gallery photo"}
                loading="lazy"
                /* object-cover: fills the fixed card area without distortion
                   object-center: anchors crop to the center — keeps faces visible
                   absolute inset-0 w-full h-full: fills the aspect-ratio box
                   transition + hover:scale: subtle zoom on hover only    */
                className="absolute inset-0 w-full h-full
                           object-cover object-center
                           transition-transform duration-300 hover:scale-105"
              />

              {/* Gradient title overlay — only when photo has a title */}
              {photo.title && (
                <div
                  className="absolute bottom-0 inset-x-0
                                bg-gradient-to-t from-black/65 via-black/20 to-transparent
                                px-3 pt-8 pb-3"
                >
                  <p className="text-white text-xs font-semibold leading-snug line-clamp-2 drop-shadow">
                    {photo.title}
                  </p>
                </div>
              )}
            </div>

            {/* Card body — only rendered when description exists */}
            {photo.description && (
              <div className="px-3 py-2.5">
                <p className="text-xs text-gray-500 dark:text-purple-400 leading-relaxed line-clamp-2">
                  {photo.description}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* ── Right arrow ── */}
      <button
        onClick={scrollRight}
        aria-label="Scroll right"
        className="absolute -right-5 top-[45%] -translate-y-1/2 z-10
                   w-10 h-10 flex items-center justify-center
                   rounded-full bg-white dark:bg-purple-800 shadow-md
                   text-gray-600 dark:text-white
                   hover:bg-purple-50 dark:hover:bg-purple-700
                   border border-gray-100 dark:border-purple-700
                   transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/gallery/")
      .then((res) => setPhotos(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="transition-colors duration-200">
      {/* ── Gallery section — first on the page ── */}
      <section className="bg-white dark:bg-purple-950 py-10 transition-colors duration-200">
        {/* px-10 on desktop gives the negative-margin arrow buttons room to breathe
            without spilling into the viewport edge                                  */}
        <div className="max-w-7xl mx-auto px-10 sm:px-14">
          {/* Section header */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-purple-500 dark:text-purple-300 uppercase mb-1">
                Community
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                Qualifier Gallery
              </h2>
            </div>
            <button
              onClick={() => navigate("/gallery/add")}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                         text-purple-600 dark:text-purple-300
                         border border-purple-200 dark:border-purple-700
                         rounded-xl hover:bg-purple-50 dark:hover:bg-purple-800
                         transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Photo
            </button>
          </div>

          {/* Multi-card carousel */}
          <GalleryCarousel photos={photos} />
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="bg-purple-50 dark:bg-purple-900 border-b border-purple-100 dark:border-purple-800 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <svg
            className="mx-auto mb-5 text-purple-300 dark:text-purple-700 w-10 h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl sm:text-3xl font-light text-purple-900 dark:text-purple-100 italic leading-relaxed">
            "You can have everything in life you want, if you help enough other
            people get what they want."
          </blockquote>
          <p className="mt-5 text-sm text-purple-400 dark:text-purple-500 font-medium tracking-wide">
            — Bill Britt
          </p>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bg-white dark:bg-purple-950 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-purple-500 dark:text-purple-300 uppercase mb-3">
                About Us
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 leading-snug">
                Building leaders, one IBO at a time
              </h2>
              <p className="text-gray-600 dark:text-purple-300 leading-relaxed mb-4">
                Vision 20000 is an elite AIC community of dedicated IBOs working
                together to achieve exceptional results. We are unified by
                shared values of integrity, teamwork, and the pursuit of
                excellence.
              </p>
              <p className="text-gray-600 dark:text-purple-300 leading-relaxed">
                Through events, resources, and a supportive leadership network,
                Vision 20000 equips every IBO with the tools and mindset needed
                to build a thriving business and a life of purpose.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Events",
                  desc: "Regular training & recognition events to celebrate milestones",
                  icon: "🗓️",
                },
                {
                  label: "Resources",
                  desc: "Curated tools and materials for every stage of your journey",
                  icon: "📚",
                },
                {
                  label: "Leadership",
                  desc: "Proven mentors guiding you toward your goals",
                  icon: "⭐",
                },
                {
                  label: "Community",
                  desc: "A network of IBOs who lift each other up",
                  icon: "🤝",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-50 dark:bg-purple-900 rounded-2xl p-5 border border-gray-100 dark:border-purple-800 shadow-sm"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 text-sm">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-purple-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
