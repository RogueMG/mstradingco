import { ImagePlus, Link2, Loader2, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";

import { adminImageSrc, type AdminImage } from "../../shared/admin";
import { buttonClass, inputClass } from "./styles";
import { useUpload } from "./useUpload";

interface ImageInputProps {
  label: string;
  value: AdminImage | null;
  onChange: (image: AdminImage | null) => void;
  error?: string;
  required?: boolean;
  /** Alt text to suggest for a new image. */
  defaultAlt?: string;
}

/** One image: upload (resized to WebP in the browser) or paste an https link; alt text required. */
function ImageInput({ label, value, onChange, error, required, defaultAlt = "" }: ImageInputProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload();
  const [linkMode, setLinkMode] = useState(false);
  const [link, setLink] = useState("");
  const altId = useId();
  const src = adminImageSrc(value, true);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    const image = await upload(file, value?.alt || defaultAlt);
    if (image) onChange(image);
  };

  const useLink = () => {
    const url = link.trim();
    if (!/^https:\/\/\S+$/i.test(url)) return;
    onChange({ key: null, url, alt: value?.alt || defaultAlt, width: null, height: null });
    setLink("");
    setLinkMode(false);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-[#f4511e]"> *</span>}
      </p>

      <div className="mt-1.5 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:flex-row">
        <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white sm:w-36">
          {src ? (
            <img src={src} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="text-slate-300" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass.secondary} onClick={() => fileInput.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
              {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            <button type="button" className={buttonClass.secondary} onClick={() => setLinkMode((open) => !open)}>
              <Link2 size={15} /> Paste link
            </button>
            {value && (
              <button type="button" className={buttonClass.danger} onClick={() => onChange(null)}>
                <Trash2 size={15} /> Remove
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                void pickFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>

          {linkMode && (
            <div className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://example.com/photo.jpg"
                className={inputClass.replace("mt-1.5 ", "")}
              />
              <button type="button" className={buttonClass.primary} onClick={useLink}>
                Use
              </button>
            </div>
          )}

          {value && (
            <div>
              <label htmlFor={altId} className="text-xs font-semibold text-slate-600">
                Alt text <span className="text-[#f4511e]">*</span>
              </label>
              <input
                id={altId}
                value={value.alt}
                onChange={(event) => onChange({ ...value, alt: event.target.value })}
                placeholder="Describe the image, e.g. Orange safety helmet"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageInput;
