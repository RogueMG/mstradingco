function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 pt-32"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#063b73]/15 border-t-[#f4511e]" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default PageLoading;
