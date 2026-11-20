import { Archive, Inbox, Loader2, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { AdminEnquiry, EnquiryStatus } from "../../shared/admin";
import { adminApi } from "./api";
import { buttonClass } from "./styles";
import { errorMessage, useToast } from "./toast";

const TABS: { status: EnquiryStatus | "all"; label: string }[] = [
  { status: "new", label: "New" },
  { status: "read", label: "Read" },
  { status: "archived", label: "Archived" },
  { status: "all", label: "All" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/** Enquiries inbox: list by status, open one to read it, mark it read or archived, or delete it. */
function EnquiriesPage() {
  const toast = useToast();
  const [tab, setTab] = useState<EnquiryStatus | "all">("new");
  const [data, setData] = useState<{ enquiries: AdminEnquiry[]; counts: Record<string, number> } | null>(null);
  // The open enquiry is kept here, so it stays visible after its status
  // changes and it moves out of the current tab's list.
  const [current, setCurrent] = useState<AdminEnquiry | null>(null);

  const reload = useCallback(async () => {
    try {
      setData(await adminApi.enquiries(tab));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }, [tab, toast]);

  // Load whenever the tab changes (event handlers use reload()).
  useEffect(() => {
    let cancelled = false;
    adminApi
      .enquiries(tab)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && toast.error(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [tab, toast]);

  const setStatus = async (enquiry: AdminEnquiry, status: EnquiryStatus) => {
    try {
      await adminApi.setEnquiryStatus(enquiry.id, status);
      toast.success(status === "archived" ? "Enquiry archived." : status === "read" ? "Marked as read." : "Marked as new.");
      setCurrent({ ...enquiry, status });
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const remove = async (enquiry: AdminEnquiry) => {
    if (!window.confirm(`Delete this enquiry from ${enquiry.name}? This can't be undone.`)) return;
    try {
      await adminApi.deleteEnquiry(enquiry.id);
      toast.success("Enquiry deleted.");
      setCurrent(null);
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const open = async (enquiry: AdminEnquiry) => {
    setCurrent(enquiry);
    // Opening a new enquiry marks it as read.
    if (enquiry.status === "new") {
      try {
        await adminApi.setEnquiryStatus(enquiry.id, "read");
        setCurrent({ ...enquiry, status: "read" });
        await reload();
      } catch (err) {
        toast.error(errorMessage(err));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-[#063b73]">Enquiries</h1>
        <div role="tablist" className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          {TABS.map((item) => (
            <button
              key={item.status}
              role="tab"
              aria-selected={tab === item.status}
              type="button"
              onClick={() => {
                setTab(item.status);
                setCurrent(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${tab === item.status ? "bg-[#063b73] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {item.label}
              {item.status !== "all" && data?.counts[item.status] ? ` (${data.counts[item.status]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Loading enquiries…
        </p>
      ) : data.enquiries.length === 0 && !current ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          <Inbox className="mx-auto mb-2 text-slate-300" /> No enquiries here.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
          <ul className="space-y-2">
            {data.enquiries.map((enquiry) => (
              <li key={enquiry.id}>
                <button
                  type="button"
                  onClick={() => void open(enquiry)}
                  className={`w-full rounded-xl border bg-white p-3 text-left shadow-sm transition ${current?.id === enquiry.id ? "border-[#063b73]" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${enquiry.status === "new" ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {enquiry.name}
                      {enquiry.company && <span className="font-normal text-slate-500"> · {enquiry.company}</span>}
                    </span>
                    {enquiry.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-[#f4511e]" aria-label="New" />}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{enquiry.interest || enquiry.message}</span>
                  <span className="mt-1 block text-xs text-slate-400">{formatDate(enquiry.createdAt)}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="min-w-0">
            {current ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#063b73]">{current.name}</h2>
                <p className="text-sm text-slate-500">
                  {current.company && `${current.company} · `}
                  {formatDate(current.createdAt)}
                </p>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
                    <dd>
                      <a className="inline-flex items-center gap-1.5 font-semibold text-[#063b73] hover:underline" href={`mailto:${current.email}`}>
                        <Mail size={14} /> {current.email}
                      </a>
                    </dd>
                  </div>
                  {current.phone && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt>
                      <dd>
                        <a className="inline-flex items-center gap-1.5 font-semibold text-[#063b73] hover:underline" href={`tel:${current.phone.replace(/[^\d+]/g, "")}`}>
                          <Phone size={14} /> {current.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {current.interest && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Interested in</dt>
                      <dd className="font-semibold text-slate-700">{current.interest}</dd>
                    </div>
                  )}
                  {current.sourcePage && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sent from</dt>
                      <dd>
                        <a className="text-[#063b73] hover:underline" href={current.sourcePage} target="_blank" rel="noreferrer">
                          {current.sourcePage}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <p className="mt-5 whitespace-pre-wrap rounded-xl bg-[#f5f8fc] p-4 text-sm leading-6 text-slate-700">{current.message}</p>

                <p className="mt-3 text-xs text-slate-400">
                  Email notification:{" "}
                  {current.emailStatus === "sent" ? "sent" : current.emailStatus === "failed" ? "failed (see docs/API.md)" : "not switched on yet"}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {current.status !== "new" && (
                    <button type="button" className={buttonClass.secondary} onClick={() => void setStatus(current, "new")}>
                      <MailOpen size={15} /> Mark as new
                    </button>
                  )}
                  {current.status !== "read" && (
                    <button type="button" className={buttonClass.secondary} onClick={() => void setStatus(current, "read")}>
                      <MailOpen size={15} /> Mark as read
                    </button>
                  )}
                  {current.status !== "archived" && (
                    <button type="button" className={buttonClass.secondary} onClick={() => void setStatus(current, "archived")}>
                      <Archive size={15} /> Archive
                    </button>
                  )}
                  <a className={buttonClass.primary} href={`mailto:${current.email}?subject=${encodeURIComponent("Re: your enquiry")}`}>
                    <Mail size={15} /> Reply by email
                  </a>
                  <button type="button" className={`${buttonClass.danger} sm:ml-auto`} onClick={() => void remove(current)}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </article>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">Choose an enquiry to read it.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnquiriesPage;
