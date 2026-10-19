import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}

/** Navy page header used on inner pages, with room for the fixed navbar. */
function PageHeader({ eyebrow, title, description, crumbs }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-[#05294f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(11,95,165,0.55),transparent_55%)]" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f4511e]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-40 lg:px-12">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-blue-100/60">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight size={13} aria-hidden="true" />}

                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#f4511e]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a65]">
              {eyebrow}
            </span>
          </div>
        )}

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100/75">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export default PageHeader;
