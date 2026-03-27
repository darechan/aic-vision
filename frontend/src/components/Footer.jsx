export default function Footer() {
  return (
    <footer className="bg-purple-900 border-t border-purple-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-bold tracking-widest text-purple-100 uppercase mb-1">
          Vision 20000
        </p>
        <p className="text-xs text-purple-500">
          © {new Date().getFullYear()} Vision 20000 · For authorized IBOs only
        </p>
      </div>
    </footer>
  );
}
