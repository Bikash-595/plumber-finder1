import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          The page you tried to open doesn’t exist or has not been built yet. Let’s get you back to a working page.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-sky-700"
          >
            Go to homepage
          </Link>
          <Link
            href="/find"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Search plumbers
          </Link>
        </div>
      </div>
    </main>
  );
}
