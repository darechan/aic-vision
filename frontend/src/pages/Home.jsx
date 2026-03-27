export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-purple-300 text-xs font-bold tracking-widest uppercase mb-5">
            Welcome to
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Vision 20000
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto leading-relaxed">
            A thriving AIC community of Independent Business Owners committed
            to growth, leadership, and building extraordinary lives together.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-purple-900 border-b border-purple-800">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <svg
            className="mx-auto mb-5 text-purple-700 w-10 h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl sm:text-3xl font-light text-purple-100 italic leading-relaxed">
            "Success is not the key to happiness. Happiness is the key to
            success. If you love what you are doing, you will be successful."
          </blockquote>
          <p className="mt-5 text-sm text-purple-500 font-medium tracking-wide">
            — Albert Schweitzer
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-purple-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-purple-300 uppercase mb-3">
                About Us
              </p>
              <h2 className="text-2xl font-bold text-white mb-5 leading-snug">
                Building leaders, one IBO at a time
              </h2>
              <p className="text-purple-300 leading-relaxed mb-4">
                Vision 20000 is an elite AIC community of dedicated IBOs
                working together to achieve exceptional results. We are unified
                by shared values of integrity, teamwork, and the pursuit of
                excellence.
              </p>
              <p className="text-purple-300 leading-relaxed">
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
                  className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-purple-900 mb-1 text-sm">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
