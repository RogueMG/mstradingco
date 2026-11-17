/**
 * Browser-side image preparation: resize to at most 1600 px (plus a 400 px
 * thumbnail) and convert to WebP before upload, so the server never has to
 * process images.
 */
const FULL_MAX = 1600;
const THUMB_MAX = 400;
const QUALITY = 0.82;
const MAX_ORIGINAL_BYTES = 30 * 1024 * 1024;

export interface PreparedImage {
  full: Blob;
  thumb: Blob;
  width: number;
  height: number;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not convert the image."))),
      "image/webp",
      QUALITY,
    );
  });
}

function draw(bitmap: ImageBitmap, maxSide: number) {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser can't process images.");

  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);

  return { canvas, width, height };
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file (JPG, PNG or WebP).");
  }

  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("That image is over 30 MB. Please choose a smaller one.");
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image format can't be read here. Use JPG, PNG or WebP.");
  }

  try {
    const full = draw(bitmap, FULL_MAX);
    const thumb = draw(bitmap, THUMB_MAX);
    const [fullBlob, thumbBlob] = await Promise.all([toBlob(full.canvas), toBlob(thumb.canvas)]);

    // Safari can't encode WebP and silently returns PNG instead.
    if (fullBlob.type !== "image/webp" || thumbBlob.type !== "image/webp") {
      throw new Error("This browser can't convert images to WebP. Please upload from Chrome, Edge or Firefox.");
    }

    return { full: fullBlob, thumb: thumbBlob, width: full.width, height: full.height };
  } finally {
    bitmap.close();
  }
}
