import { CheckCircle2, ExternalLink, FolderTree, Inbox, Loader2, Settings as SettingsIcon, ShieldAlert, Tag, Factory, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router";

import { adminApi } from "./api";
import BrandsPage from "./BrandsPage";
import CataloguePage from "./CataloguePage";
import EnquiriesPage from "./EnquiriesPage";
import IndustriesPage from "./IndustriesPage";
import SettingsPage from "./SettingsPage";
import { ToastContext, type Toast, type ToastApi } from "./toast";

const NAV = [
  { to: "catalogue", label: "Catalogue", icon: FolderTree },
  { to: "brands", label: "Brands", icon: Tag },
  { to: "industries", label: "Industries", icon: Factory },
  { to: "enquiries", label: "Enquiries", icon: Inbox },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

/**
 * The admin panel (lazy-loaded at /admin). Cloudflare Access signs editors in
 * before this page loads; every API call is checked again on the server.
 */
function AdminApp() {
  const [me, setMe] = useState<{ email: string } | "loading" | "denied">("loading");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.title = "Admin | MS Trading Co.";
    adminApi
      .me()
      .then(setMe)
      .catch(() => setMe("denied"));
  }, []);

  const push = useCallback((kind: Toast["kind"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-3), { id, kind, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), kind === "error" ? 8000 : 4000);
  }, []);

  const toastApi = useMemo<ToastApi>(
    () => ({ success: (message) => push("success", message), error: (message) => push("error", message) }),
    [push],
  );

  if (me === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] text-sm text-slate-500">
        <Loader2 size={18} className="mr-2 animate-spin" /> Checking your sign-in…
      </div>
    );
  }

  if (me === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto text-[#f4511e]" size={32} />
          <h1 className="mt-4 text-xl font-bold text-[#063b73]">Sign-in required</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The admin is protected by Cloudflare Access. Reload the page to sign in with your email code. If you keep seeing this,
            ask the site owner to add your email to the allowed list.
          </p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-[#063b73] px-4 py-2 text-sm font-bold text-white">
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToastContext.Provider value={toastApi}>
      <div className="min-h-screen bg-[#f5f8fc]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <img src="/images/logo/ms-trading-logo.png" alt="" className="h-9 w-auto" />
              <span className="text-sm font-bold text-[#063b73]">Admin</span>
            </div>

            <nav aria-label="Admin sections" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={`/admin/${to}`}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive ? "bg-[#063b73] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="hidden md:inline">{me.email}</span>
              <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#063b73] hover:underline">
                View site <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6">
          <Routes>
            <Route index element={<Navigate to="catalogue" replace />} />
            <Route path="catalogue" element={<CataloguePage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="industries" element={<IndustriesPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="catalogue" replace />} />
          </Routes>
        </main>

        <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex w-[min(92vw,380px)] flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className={`flex items-start gap-2 rounded-xl border p-3 text-sm shadow-lg ${
                toast.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {toast.kind === "error" ? <XCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default AdminApp;
