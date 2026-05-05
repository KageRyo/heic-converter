import decode from "heic-decode";

self.onmessage = async (e) => {
  const { file, format, quality } = e.data;

  try {
    const buffer = await file.arrayBuffer();
    const { width, height, data } = await decode({ buffer: new Uint8Array(buffer) });

    // We can't use Canvas in a standard Web Worker unless it's an OffscreenCanvas.
    // OffscreenCanvas is widely supported in modern browsers.
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not create offscreen canvas context");
    }

    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);

    const blob = await canvas.convertToBlob({
      type: format,
      quality: format === "image/jpeg" ? quality : undefined,
    });

    const newName = file.name.replace(/\.(heic|heif)$/i, format === "image/jpeg" ? ".jpg" : ".png");

    self.postMessage({
      success: true,
      blob,
      name: newName,
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: (error as Error).message,
    });
  }
};
