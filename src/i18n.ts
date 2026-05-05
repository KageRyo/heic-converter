import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      select_files: "Select HEIC/HEIF Files",
      drop_hint: "Click to select or drag and drop .heic / .heif files",
      files_selected: "{{count}} file(s) selected",
      output_format: "Output Format",
      jpg_quality: "JPG Quality: {{quality}}",
      quality_hint: "Higher quality results in clearer images but larger file sizes. 1.0 is recommended for best results.",
      convert_button: "Convert {{count}} File",
      convert_button_plural: "Convert {{count}} Files",
      converting: "Converting...",
      clear: "Clear",
      processing: "Processing... {{progress}}%",
      complete_summary: "Conversion complete: {{success}} successful, {{failed}} failed",
      download: "Download",
      download_all: "Download All as ZIP",
      unsupported_skipped: "{{count}} unsupported files skipped. Only .heic and .heif are supported."
    }
  },
  "zh-TW": {
    translation: {
      select_files: "選擇 HEIC/HEIF 檔案",
      drop_hint: "點擊選擇或拖放 .heic / .heif 檔案",
      files_selected: "已選擇 {{count}} 個檔案",
      output_format: "輸出格式",
      jpg_quality: "JPG 品質：{{quality}}",
      quality_hint: "品質越高圖像越清晰，但檔案體積也會越大。建議設定為 1.0 以獲得最佳效果。",
      convert_button: "轉換 {{count}} 個檔案",
      convert_button_plural: "轉換 {{count}} 個檔案",
      converting: "轉檔中...",
      clear: "清除",
      processing: "處理中... {{progress}}%",
      complete_summary: "轉檔完成：{{success}} 成功，{{failed}} 失敗",
      download: "下載",
      download_all: "下載全部 (ZIP)",
      unsupported_skipped: "已跳過 {{count}} 個不支援的檔案。僅支援 .heic 與 .heif 格式。"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
