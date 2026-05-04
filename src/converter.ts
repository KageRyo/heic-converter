import decode from "heic-decode";

export type OutputFormat = "image/jpeg" | "image/png";

export interface ConversionOptions {
  format: OutputFormat;
  quality?: number;
}

export interface ConversionResult {
  blob: Blob;
  name: string;
  url: string;
}

export async function convertHeic(
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> {
  const { format, quality } = options;

  try {
    const buffer = await file.arrayBuffer();
    const { width, height, data } = await decode({ buffer: new Uint8Array(buffer) });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not create canvas context");
    }

    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = file.name.replace(/\.(heic|heif)$/i, format === "image/jpeg" ? ".jpg" : ".png");
            const url = URL.createObjectURL(blob);
            resolve({
              blob,
              name: newName,
              url,
            });
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        },
        format,
        format === "image/jpeg" ? quality : undefined
      );
    });
  } catch (error) {
    console.error("Conversion failed:", error);
    throw new Error(`Failed to convert ${file.name}: ${(error as Error).message}`);
  }
}
