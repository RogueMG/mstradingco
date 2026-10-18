import ContentState from "./ContentState";
import EnquiryBand from "../products/EnquiryBand";
import PageHeader from "./PageHeader";
import { usePageMeta } from "../../lib/usePageMeta";

interface ComingSoonProps {
  title: string;
  eyebrow: string;
}

/** Placeholder for pages that are still being built. */
function ComingSoon({ title, eyebrow }: ComingSoonProps) {
  usePageMeta(title);

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        crumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />

      <section className="bg-[#f5f8fc] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <ContentState
            kind="empty"
            title="This page is being prepared"
            message="In the meantime, browse our product range or get in touch for a quote."
            backHref="/products"
            backLabel="Browse products"
          />

          <div className="mt-12">
            <EnquiryBand
              title="Need a quote?"
              description="Message, email or call us with your requirements."
              subject="safety equipment"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default ComingSoon;
