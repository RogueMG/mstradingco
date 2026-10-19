import { useParams } from "react-router";

import EnquiryBand from "../components/products/EnquiryBand";
import ProductCard from "../components/products/ProductCard";
import ContentState from "../components/ui/ContentState";
import PageHeader from "../components/ui/PageHeader";
import PageLoading from "../components/ui/PageLoading";
import { useCategory } from "../lib/content/hooks";
import { usePageMeta } from "../lib/usePageMeta";

function CategoryPage() {
  const { category: slug = "" } = useParams();
  const category = useCategory(slug);
  const data = category.status === "ready" ? category.data : null;

  usePageMeta(
    data ? data.title : category.status === "ready" ? "Category not found" : undefined,
    data?.summary || undefined,
  );

  if (category.status === "loading") {
    return <PageLoading />;
  }

  if (category.status === "error") {
    return (
      <section className="bg-[#f5f8fc] px-6 pb-24 pt-40">
        <ContentState
          headingLevel="h1"
          kind="error"
          title="We couldn't load this category"
          message="Please check your connection and try again."
          onRetry={category.retry}
          backHref="/products"
          backLabel="All products"
        />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-[#f5f8fc] px-6 pb-24 pt-40">
        <ContentState
          headingLevel="h1"
          kind="not-found"
          title="Category not found"
          message="This category may have moved or no longer exists."
          backHref="/products"
          backLabel="All products"
        />
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={data.eyebrow || "Products"}
        title={data.title}
        description={data.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: data.title },
        ]}
      />

      <section className="bg-[#f5f8fc] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          {data.products.length === 0 ? (
            <ContentState
              kind="empty"
              title="Products coming soon"
              message={`We're adding ${data.title.toLowerCase()} products to the catalogue. Ask us for what you need in the meantime.`}
              backHref="/products"
              backLabel="All products"
            />
          ) : (
            <>
              <p className="mb-8 text-sm font-semibold text-slate-500">
                {data.products.length}{" "}
                {data.products.length === 1 ? "product" : "products"}
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          <div className="mt-12">
            <EnquiryBand
              title={`Looking for ${data.title.toLowerCase()}?`}
              description="Share your quantities and specifications and we'll get back with a quote."
              subject={data.title}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default CategoryPage;
