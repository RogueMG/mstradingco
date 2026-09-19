import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";

const productLinks = [
  { label: "Head Protection", href: "/products#head-protection" },
  { label: "Foot Protection", href: "/products#foot-protection" },
  { label: "Body & PPE", href: "/products#body-ppe" },
  {
    label: "Eye, Ear & Respiratory",
    href: "/products#eye-ear-respiratory",
  },
  { label: "Road & Site Safety", href: "/products#road-site-safety" },
  { label: "Power Tools", href: "/products#power-tools" },
  { label: "Hand Tools", href: "/products#hand-tools" },
  { label: "Steel & Hardware", href: "/products#steel-hardware" },
];

function Footer() {
  return (
    <footer className="bg-[#041f3d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#041f3d]"
              aria-label="MS Trading Co. home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-black text-[#063b73]">
                MS
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  MS Trading Co.
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/50">
                  Industrial Safety & Supply
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-blue-100/60">
              Industrial safety equipment, PPE, power tools, hand tools and
              hardware supply for B2B and institutional requirements.
            </p>

            <Link
              to="/contact"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#f4511e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
            >
              Start an Enquiry
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Products
            </h2>

            <nav aria-label="Product categories" className="mt-5">
              <ul className="grid grid-cols-1 gap-3">
                {productLinks.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-blue-100/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Contact
            </h2>

            <div className="mt-5 space-y-5">
              <a
                href="tel:+918939575200"
                className="flex gap-3 text-sm text-blue-100/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#f4511e]"
                  aria-hidden="true"
                />

                <span>
                  <span className="block font-semibold text-white">
                    +91 89395 75200
                  </span>
                  <span className="mt-1 block">044 4512 2249</span>
                </span>
              </a>

              <a
                href="mailto:mstrading52@yahoo.com"
                className="flex gap-3 text-sm text-blue-100/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#f4511e]"
                  aria-hidden="true"
                />

                <span className="break-all">mstrading52@yahoo.com</span>
              </a>

              <div className="flex gap-3 text-sm leading-6 text-blue-100/60">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#f4511e]"
                  aria-hidden="true"
                />

                <span>
                  No. 232/178,
                  <br />
                  Linghi Chetty Street,
                  <br />
                  Chennai – 600 001,
                  <br />
                  Tamil Nadu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-4 text-xs text-blue-100/40 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} MS Trading Co. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                to="/about"
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                About
              </Link>

              <Link
                to="/brands"
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                Brands
              </Link>

              <Link
                to="/gallery"
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                Gallery
              </Link>

              <Link
                to="/contact"
                className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
              >
                Contact
              </Link>
            </div>

            <p>
              GSTIN: 33GFZPM1541E1Z9
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;