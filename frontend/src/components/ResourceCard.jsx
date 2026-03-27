export default function ResourceCard({ resource }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-900 text-base mb-2">{resource.title}</h3>
      {resource.description && (
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
          {resource.description}
        </p>
      )}
      {resource.link ? (
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          Open Resource
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      ) : (
        <span className="mt-auto text-xs text-gray-300">No link available</span>
      )}
    </div>
  );
}
