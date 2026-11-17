import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Link2, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { adminImageSrc, type AdminImage } from "../../shared/admin";
import { buttonClass, inputClass } from "./styles";
import { useUpload } from "./useUpload";

interface ImageListProps {
  images: AdminImage[];
  onChange: (images: AdminImage[]) => void;
  defaultAlt: string;
  error?: string;
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * A product's images. Drag (or use the arrows) to reorder; the first image is
 * the main one. Each image needs alt text.
 */
function ImageList({ images, onChange, defaultAlt, error }: ImageListProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [link, setLink] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    let next = images;
    for (const file of Array.from(files)) {
      const image = await upload(file, defaultAlt);
      if (image) {
        next = [...next, image];
        onChange(next);
      }
    }
  };

  const addLink = () => {
    const url = link.trim();
    if (!/^https:\/\/\S+$/i.test(url)) return;
    onChange([...images, { key: null, url, alt: defaultAlt, width: null, height: null }]);
    setLink("");
  };

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">
        Images <span className="text-[#f4511e]">*</span>
        <span className="ml-2 text-xs font-normal text-slate-500">The first image is the main one. Drag to reorder.</span>
      </p>

      <ul className="mt-2 space-y-2">
        {images.map((image, index) => (
          <li
            key={`${image.key ?? image.url}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => {
              event.preventDefault();
              if (dragIndex === null || dragIndex === index) return;
              onChange(move(images, dragIndex, index));
              setDragIndex(index);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-3 rounded-xl border bg-white p-2 ${
              dragIndex === index ? "border-[#0b5fa5] shadow-md" : "border-slate-200"
            }`}
          >
            <GripVertical size={18} className="shrink-0 cursor-grab text-slate-400" aria-hidden="true" />

            <img src={adminImageSrc(image, true) ?? ""} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {index === 0 && <span className="rounded bg-[#063b73] px-1.5 py-0.5 font-bold text-white">Main</span>}
                <span className="truncate">{image.key ? "Uploaded" : image.url}</span>
              </div>
              <input
                aria-label={`Alt text for image ${index + 1}`}
                value={image.alt}
                onChange={(event) =>
                  onChange(images.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)))
                }
                placeholder="Alt text (required): describe the image"
                className={`${inputClass} ${image.alt.trim() ? "" : "border-red-300"}`}
              />
            </div>

            <div className="flex shrink-0 flex-col">
              <button type="button" className={buttonClass.icon} aria-label="Move up" disabled={index === 0} onClick={() => onChange(move(images, index, index - 1))}>
                <ArrowUp size={15} />
              </button>
              <button type="button" className={buttonClass.icon} aria-label="Move down" disabled={index === images.length - 1} onClick={() => onChange(move(images, index, index + 1))}>
                <ArrowDown size={15} />
              </button>
            </div>

            <button type="button" className={buttonClass.icon} aria-label="Remove image" onClick={() => onChange(images.filter((_, i) => i !== index))}>
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button type="button" className={buttonClass.secondary} onClick={() => fileInput.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <div className="flex flex-1 gap-2">
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="…or paste an https:// image link"
            className={inputClass.replace("mt-1.5 ", "")}
          />
          <button type="button" className={buttonClass.secondary} onClick={addLink}>
            <Link2 size={15} /> Add
          </button>
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

export default ImageList;
