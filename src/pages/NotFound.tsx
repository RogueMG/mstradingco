import ContentState from "../components/ui/ContentState";
import { usePageMeta } from "../lib/usePageMeta";

function NotFound() {
  usePageMeta("Page not found");

  return (
    <section className="bg-[#f5f8fc] px-6 pb-24 pt-40">
      <ContentState
        headingLevel="h1"
        kind="not-found"
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        backHref="/products"
        backLabel="Browse products"
      />
    </section>
  );
}

export default NotFound;
