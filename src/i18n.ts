import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      title: "HEIC Converter",
      privacy_note: "Privacy First:",
      privacy_desc: "All conversions happen locally in your browser. No images are uploaded to any server.",
      select_files: "Select HEIC/HEIF Files",
      drop_hint: "Click to select or drag and drop .heic / .heif files",
      files_selected: "{{count}} file(s) selected",
      output_format: "Output Format",
      jpg_quality: "JPG Quality: {{quality}}",
      convert_button: "Convert {{count}} File",
      convert_button_plural: "Convert {{count}} Files",
      converting: "Converting...",
      clear: "Clear",
      processing: "Processing... {{progress}}%",
      complete_summary: "Conversion complete: {{success}} successful, {{failed}} failed",
      download: "Download",
      unsupported_skipped: "{{count}} unsupported files skipped. Only .heic and .heif are supported.",
      footer_made_by: "Made by",
      footer_with: "With",
      footer_license: "MIT License"
    }
  },
  "zh-TW": {
    translation: {
      title: "HEIC 轉檔器",
      privacy_note: "隱私優先：",
      privacy_desc: "所有轉檔程序皆在您的瀏覽器中本地執行，圖片不會上傳到任何伺服器。",
      select_files: "選擇 HEIC/HEIF 檔案",
      drop_hint: "點擊選擇或拖放 .heic / .heif 檔案",
      files_selected: "已選擇 {{count}} 個檔案",
      output_format: "輸出格式",
      jpg_quality: "JPG 品質：{{quality}}",
      convert_button: "轉換 {{count}} 個檔案",
      convert_button_plural: "轉換 {{count}} 個檔案",
      converting: "轉檔中...",
      clear: "清除",
      processing: "處理中... {{progress}}%",
      complete_summary: "轉檔完成：{{success}} 成功，{{failed}} 失敗",
      download: "下載",
      unsupported_skipped: "已跳過 {{count}} 個不支援的檔案。僅支援 .heic 與 .heif 格式。",
      footer_made_by: "由",
      footer_with: "製作，使用",
      footer_license: "MIT 授權"
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
