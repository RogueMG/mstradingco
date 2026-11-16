import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

import { formatAddress, mapsEmbedUrl, mapsLink, type SiteLocation } from "../../../shared/site";

interface LocationMapProps {
  location: SiteLocation;
}

/**
 * Click-to-load Google Map. Shows a static placeholder (address and an "Open in
 * Google Maps" link) and only loads the map iframe, with its cookies and
 * scripts, after the visitor asks for it.
 */
function LocationMap({ location }: LocationMapProps) {
  const [loaded, setLoaded] = useState(false);
  const address = formatAddress(location);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="font-bold">{location.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{address}</p>
        <a
          href={mapsLink(location)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          Open in Google Maps
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="border-t border-slate-200 bg-slate-100 p-4">
        {loaded ? (
          <iframe
            title={`Map of ${location.name}`}
            src={mapsEmbedUrl(location)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-xl border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="flex min-h-40 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center transition hover:border-orange-300 hover:bg-orange-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <span>
              <MapPin className="mx-auto text-orange-500" size={25} aria-hidden="true" />
              <span className="mt-2 block text-sm font-semibold text-slate-800">
                Show map
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Loads Google Maps (it may set cookies)
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default LocationMap;
