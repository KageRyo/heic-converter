import heic2any from "heic2any";

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
    const result = await heic2any({
      blob: file,
      toType: format,
      quality: format === "image/jpeg" ? quality : undefined,
    });

    const resultBlob = Array.isArray(result) ? result[0] : result;
    const newName = file.name.replace(/\.(heic|heif)$/i, format === "image/jpeg" ? ".jpg" : ".png");
    const url = URL.createObjectURL(resultBlob);

    return {
      blob: resultBlob,
      name: newName,
      url: url,
    };
  } catch (error) {
    console.error("Conversion failed:", error);
    throw new Error(`Failed to convert ${file.name}`);
  }
}
