import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { SiteLocation } from "../../shared/site";
import { ApiError, adminApi, type Settings } from "./api";
import { Field, Section } from "./fields";
import { StringList } from "./ListEditors";
import { buttonClass, inputClass } from "./styles";
import { errorMessage, useToast } from "./toast";

const blankLocation = (index: number): SiteLocation => ({
  id: `location-${index + 1}`,
  name: "",
  streetAddress: "",
  locality: "",
  region: "",
  postalCode: "",
  country: "IN",
  phone: "",
  latitude: null,
  longitude: null,
  openingHours: [],
});

/** Business facts used across the site, SEO and enquiry emails. */
function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .settings()
      .then(setSettings)
      .catch((err) => toast.error(errorMessage(err)));
  }, [toast]);

  if (!settings) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading settings…
      </p>
    );
  }

  const site = settings.site;
  const setSite = (patch: Partial<Settings["site"]>) => setSettings({ ...settings, site: { ...site, ...patch } });
  const setLocation = (index: number, patch: Partial<SiteLocation>) =>
    setSite({ locations: site.locations.map((location, i) => (i === index ? { ...location, ...patch } : location)) });
  // Parsed when the field loses focus, so decimals can be typed freely.
  // Anything that isn't a number is treated as "not set".
  const coordinate = (value: string) => {
    const number = Number(value);
    return value.trim() === "" || !Number.isFinite(number) ? null : number;
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      setSettings(await adminApi.saveSettings(settings));
      toast.success("Settings saved. The site uses them on the next page load.");
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-5">
      <h1 className="text-lg font-bold text-[#063b73]">Settings</h1>

      <Section title="Business">
        <Field label="Business name" required error={errors["site.name"]}>
          <input value={site.name} onChange={(event) => setSite({ name: event.target.value })} className={inputClass} />
        </Field>
        <StringList label="Other names people search for (e.g. short name)" items={site.alternateNames} onChange={(alternateNames) => setSite({ alternateNames })} placeholder="Add name" />
        <Field label="Description" required error={errors["site.description"]} hint="Used as the home page description in search results.">
          <textarea value={site.description} rows={3} onChange={(event) => setSite({ description: event.target.value })} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Public email" required error={errors["site.email"]}>
            <input type="email" value={site.email} onChange={(event) => setSite({ email: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Main phone" required error={errors["site.phone"]} hint="International format, e.g. +91 89395 75200">
            <input value={site.phone} onChange={(event) => setSite({ phone: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Landline" error={errors["site.landline"]}>
            <input value={site.landline} onChange={(event) => setSite({ landline: event.target.value })} className={inputClass} />
          </Field>
          <Field label="WhatsApp number" required error={errors["site.whatsappNumber"]} hint="Digits only with country code, e.g. 918939575200">
            <input value={site.whatsappNumber} onChange={(event) => setSite({ whatsappNumber: event.target.value })} className={inputClass} />
          </Field>
          <Field label="GSTIN" error={errors["site.gstin"]}>
            <input value={site.gstin} onChange={(event) => setSite({ gstin: event.target.value })} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section
        title="Locations"
        actions={
          <button type="button" className={buttonClass.secondary} onClick={() => setSite({ locations: [...site.locations, blankLocation(site.locations.length)] })}>
            <Plus size={15} /> Add location
          </button>
        }
      >
        {errors["site.locations"] && <p className="text-xs font-medium text-red-600">{errors["site.locations"]}</p>}
        {site.locations.map((location, index) => {
          const err = (name: string) => errors[`site.locations.${index}.${name}`];
          return (
            <div key={index} className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">Location {index + 1}</p>
                {site.locations.length > 1 && (
                  <button type="button" className={buttonClass.icon} aria-label="Remove location" onClick={() => setSite({ locations: site.locations.filter((_, i) => i !== index) })}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" required error={err("name")}>
                  <input value={location.name} onChange={(event) => setLocation(index, { name: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Phone" error={err("phone")}>
                  <input value={location.phone} onChange={(event) => setLocation(index, { phone: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Street address" required error={err("streetAddress")}>
                  <input value={location.streetAddress} onChange={(event) => setLocation(index, { streetAddress: event.target.value })} className={inputClass} />
                </Field>
                <Field label="City" required error={err("locality")}>
                  <input value={location.locality} onChange={(event) => setLocation(index, { locality: event.target.value })} className={inputClass} />
                </Field>
                <Field label="State" error={err("region")}>
                  <input value={location.region} onChange={(event) => setLocation(index, { region: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Postal code" error={err("postalCode")}>
                  <input value={location.postalCode} onChange={(event) => setLocation(index, { postalCode: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Latitude" error={err("latitude")} hint="Optional, e.g. 13.0950. Improves the map pin.">
                  <input inputMode="decimal" defaultValue={location.latitude ?? ""} onBlur={(event) => setLocation(index, { latitude: coordinate(event.target.value) })} className={inputClass} />
                </Field>
                <Field label="Longitude" error={err("longitude")} hint="Optional, e.g. 80.2870.">
                  <input inputMode="decimal" defaultValue={location.longitude ?? ""} onBlur={(event) => setLocation(index, { longitude: coordinate(event.target.value) })} className={inputClass} />
                </Field>
              </div>
              <StringList
                label='Opening hours (e.g. "Mo-Sa 09:30-18:30")'
                items={location.openingHours}
                onChange={(openingHours) => setLocation(index, { openingHours })}
                placeholder="Add opening hours"
              />
            </div>
          );
        })}
      </Section>

      <Section title="Enquiry notifications">
        <Field
          label="Send new enquiries to"
          error={errors["private.notifyEmail"]}
          hint="Private: never shown on the site. Emails start once Email Routing is set up (see docs/API.md)."
        >
          <input
            type="email"
            value={settings.private.notifyEmail}
            onChange={(event) => setSettings({ ...settings, private: { ...settings.private, notifyEmail: event.target.value } })}
            className={inputClass}
          />
        </Field>
      </Section>

      <button type="submit" className={buttonClass.primary} disabled={saving}>
        <Save size={15} /> {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

export default SettingsPage;
