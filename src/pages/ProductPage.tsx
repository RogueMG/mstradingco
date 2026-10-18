import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  CheckCircle2,
  ChevronRight,
  Info,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import ProductCard from "../components/products/ProductCard";
import ContentImg from "../components/ui/ContentImg";
import ContentState from "../components/ui/ContentState";
import PageLoading from "../components/ui/PageLoading";
import { company, emailLink, whatsappLink } from "../data/company";
import { useProduct } from "../lib/content/hooks";
import type { ContentImage, Product } from "../lib/content/types";
import { usePageMeta } from "../lib/usePageMeta";

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-7 text-slate-600 first:mt-0">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-bold text-[#063b73] first:mt-0">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-600 marker:text-[#f4511e]">
        {children}
      </ul>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0b1f33]">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
  },
};

function Gallery({ images, title }: { images: ContentImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? null;

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-[#f5f8fc]">
        <ContentImg
          key={current?.src ?? "empty"}
          image={current}
          fallbackAlt={title}
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={1280}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === active}
              className={`aspect-square overflow-hidden rounded-xl border-2 bg-[#f5f8fc] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30 ${
                index === active
                  ? "border-[#f4511e]"
                  : "border-transparent hover:border-[#0b5fa5]/30"
              }`}
            >
              <ContentImg
                image={image}
                fallbackAlt=""
                sizes="120px"
                width={240}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const subject = product.brand
    ? `${product.title} (${product.brand.name})`
    : product.title;
  const message = `Hello ${company.name}, I'd like a quote for ${subject}.`;
  const hasDetails =
    product.keyFeatures.length > 0 ||
    product.description.length > 0 ||
    product.specifications.length > 0;

  return (
    <>
      <section className="bg-white pb-16 pt-32 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
              <li>
                <Link to="/" className="transition hover:text-[#063b73]">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={13} aria-hidden="true" />
                <Link to="/products" className="transition hover:text-[#063b73]">
                  Products
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={13} aria-hidden="true" />
                <Link
                  to={`/products/${product.category.slug}`}
                  className="transition hover:text-[#063b73]"
                >
                  {product.category.title}
                </Link>
              </li>
              <li className="flex min-w-0 items-center gap-1.5">
                <ChevronRight size={13} aria-hidden="true" />
                <span aria-current="page" className="truncate text-[#063b73]">
                  {product.title}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Gallery images={product.images} title={product.title} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/products/${product.category.slug}`}
                  className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e] hover:underline"
                >
                  {product.category.title}
                </Link>

                {product.brand && (
                  <span className="rounded-full bg-[#f5f8fc] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#063b73]">
                    {product.brand.name}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#063b73] md:text-5xl">
                {product.title}
              </h1>

              {product.isSample && (
                <p className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Sample listing. Exact models, sizes and specifications are
                  to be confirmed; contact us for current availability.
                </p>
              )}

              {product.summary && (
                <p className="mt-6 text-base leading-7 text-slate-600">
                  {product.summary}
                </p>
              )}

              {product.variants.length > 0 && (
                <div className="mt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Available options
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <li
                        key={variant}
                        className="rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-semibold text-[#063b73]"
                      >
                        {variant}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enquiry */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/15 transition-all hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Enquire on WhatsApp
                </a>

                <a
                  href={emailLink(`Quote request: ${subject}`, message)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#063b73]/20 px-6 py-3.5 text-sm font-bold text-[#063b73] transition-all hover:border-[#063b73] hover:bg-[#063b73] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
                >
                  <Mail size={17} aria-hidden="true" />
                  Enquire by email
                </a>
              </div>

              <a
                href={company.phoneHref}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#063b73]"
              >
                <Phone size={15} className="text-[#f4511e]" aria-hidden="true" />
                Or call {company.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {hasDetails && (
        <section className="border-t border-slate-100 bg-white pb-16 md:pb-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 md:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-12">
            <div className="min-w-0">
              {product.keyFeatures.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold tracking-tight text-[#063b73]">
                    Key features
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {product.keyFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-base leading-7 text-slate-600"
                      >
                        <CheckCircle2
                          size={20}
                          className="mt-1 shrink-0 text-[#0b5fa5]"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#063b73]">
                    Description
                  </h2>
                  <div className="mt-6">
                    <PortableText
                      value={product.description}
                      components={descriptionComponents}
                    />
                  </div>
                </div>
              )}
            </div>

            {product.specifications.length > 0 && (
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-tight text-[#063b73]">
                  Specifications
                </h2>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr
                          key={`${spec.label}-${index}`}
                          className="border-b border-slate-200 last:border-b-0 odd:bg-[#f5f8fc]"
                        >
                          <th
                            scope="row"
                            className="w-2/5 px-5 py-3.5 align-top font-semibold text-[#063b73]"
                          >
                            {spec.label}
                          </th>
                          <td className="break-words px-5 py-3.5 text-slate-600">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {product.related.length > 0 && (
        <section className="bg-[#f5f8fc] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-[#063b73] md:text-4xl">
                More in {product.category.title}
              </h2>
              <Link
                to={`/products/${product.category.slug}`}
                className="text-sm font-bold text-[#063b73] hover:text-[#f4511e]"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ProductPage() {
  const { category = "", product: slug = "" } = useParams();
  const product = useProduct(category, slug);
  const data = product.status === "ready" ? product.data : null;

  usePageMeta(
    data ? data.title : product.status === "ready" ? "Product not found" : undefined,
    data?.summary || undefined,
  );

  if (product.status === "loading") {
    return <PageLoading />;
  }

  if (product.status === "error") {
    return (
      <section className="bg-[#f5f8fc] px-6 pb-24 pt-40">
        <ContentState
          kind="error"
          title="We couldn't load this product"
          message="Please check your connection and try again."
          onRetry={product.retry}
          backHref={`/products/${category}`}
          backLabel="Back to category"
        />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-[#f5f8fc] px-6 pb-24 pt-40">
        <ContentState
          kind="not-found"
          title="Product not found"
          message="This product may have moved or is no longer listed."
          backHref="/products"
          backLabel="All products"
        />
      </section>
    );
  }

  return <ProductDetails key={data.id} product={data} />;
}

export default ProductPage;
