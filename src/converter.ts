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

/**
 * Offloads HEIC conversion to a Web Worker to keep the UI responsive.
 */
export async function convertHeic(
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    // Vite handles this syntax to bundle the worker correctly
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (e) => {
      const { success, blob, name, error } = e.data;
      if (success) {
        const url = URL.createObjectURL(blob);
        resolve({ blob, name, url });
      } else {
        reject(new Error(error || "Unknown worker error"));
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      reject(new Error(e.message));
      worker.terminate();
    };

    worker.postMessage({
      file,
      format: options.format,
      quality: options.quality,
    });
  });
}
