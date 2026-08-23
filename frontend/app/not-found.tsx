import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-3xl font-bold text-purple-400">404 — Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The requested page does not exist on VyaparMind AI Platform.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
      >
        Return to Executive Dashboard
      </Link>
    </div>
  );
}
