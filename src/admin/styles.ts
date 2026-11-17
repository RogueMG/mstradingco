/* Tailwind class strings in the site's colours, shared by the admin screens. */

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0b5fa5] focus:ring-4 focus:ring-[#0b5fa5]/10 disabled:bg-slate-100";

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#f4511e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#063b73] hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0b5fa5]/20 disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60",
  icon: "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5fa5] disabled:opacity-30",
};
