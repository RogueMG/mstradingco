import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 px-4 pt-3 transition-all duration-500 md:px-6 ${
          scrolled ? "pt-3" : "pt-4 md:pt-5"
        }`}
      >
        <motion.nav
          initial={
            shouldReduceMotion
              ? false
              : {
                  y: -30,
                  opacity: 0,
                }
          }
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className={`mx-auto flex max-w-7xl items-center justify-between border px-3 transition-all duration-500 md:px-5 ${
            scrolled
              ? "rounded-xl border-slate-200/80 bg-white/90 py-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl"
              : "rounded-2xl border-white/40 bg-white/95 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={closeMenu}
            aria-label="MS Trading Co. home"
            className="group flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
          >
            <img
              src="/images/logo/ms-trading-logo.png"  
              alt="MS Trading Co."
              className={`w-auto object-contain transition-all duration-500 ${
                scrolled
                  ? "h-9 md:h-10"
                  : "h-10 md:h-12"
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center md:flex"
          >
            <div className="flex items-center gap-1">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group relative rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                >
                  {item.label}

                  <span className="absolute bottom-0 left-3 right-3 h-[2px] origin-left scale-x-0 rounded-full bg-[#f4511e] transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="tel:+918939575200"
              aria-label="Call MS Trading Co."
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#063b73] transition-all duration-300 hover:border-[#063b73] hover:bg-[#063b73] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
            >
              <Phone size={16} />
            </a>

            <a
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-[#f4511e] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d94316] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
            >
              Get a Quote

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#063b73] transition hover:border-[#063b73] hover:bg-[#063b73] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.nav>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -15,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 0,
                    y: -15,
                  }
            }
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed inset-x-4 top-[76px] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="p-3"
            >
              {navigation.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -10,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: shouldReduceMotion
                      ? 0
                      : index * 0.04,
                  }}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                >
                  {item.label}

                  <ArrowUpRight
                    size={16}
                    className="text-slate-300"
                  />
                </motion.a>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <a
                  href="tel:+918939575200"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#063b73]"
                >
                  <Phone size={16} />
                  Call
                </a>

                <a
                  href="https://wa.me/918939575200"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#f4511e] py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>

              <a
                href="/contact"
                onClick={closeMenu}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#063b73] py-3.5 text-sm font-bold text-white"
              >
                Get a Quote
                <ArrowUpRight size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;