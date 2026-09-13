import { ArrowUpRight, Menu } from "lucide-react";
import { motion } from "motion/react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/30 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md md:px-6"
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063b73] text-sm font-bold text-white">
            MS
          </div>

          <div className="leading-none">
            <div className="text-lg font-bold tracking-tight text-[#063b73]">
              MS
            </div>
            <div className="text-xs font-semibold text-[#0b5fa5]">
              Trading Co
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-[#f4511e]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/contact"
            className="hidden items-center gap-2 rounded-full bg-[#f4511e] px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] md:flex"
          >
            Get a Quote
            <ArrowUpRight size={16} />
          </a>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#063b73] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.nav>
    </header>
  );
}

export default Navbar;