const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Shrinks a picked file to at most `maxSize` pixels on its long side and returns it as a small JPEG data URL.
 * Mock phase only: Phase 10 uploads the real file to storage instead.
 */
export async function fileToDataUrl(file: File, maxSize = 1200): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 10 MB.`);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`${file.name} couldn't be read. Try a JPG or PNG.`);
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process the image.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.82);
}