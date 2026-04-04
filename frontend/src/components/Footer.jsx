export default function Footer() {
  return (
    <footer className="bg-white dark:bg-purple-900 border-t border-gray-200 dark:border-purple-800 py-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-bold tracking-widest text-purple-900 dark:text-purple-100 uppercase mb-1">
          Vision 20000
        </p>
        <p className="text-xs text-gray-400 dark:text-purple-500">
          © {new Date().getFullYear()} Vision 20000 · For authorized IBOs only
        </p>
      </div>
    </footer>
  );
}
