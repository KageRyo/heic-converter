import { useState, useRef } from "react";
import "./App.css";
import { convertHeic } from "./converter";
import type { OutputFormat, ConversionResult } from "./converter";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState<number>(0.9);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.name.toLowerCase().endsWith(".heic") || 
        file.name.toLowerCase().endsWith(".heif")
      );
      
      const invalidCount = selectedFiles.length - validFiles.length;
      if (invalidCount > 0) {
        setErrors(prev => [...prev, t("unsupported_skipped", { count: invalidCount })]);
      }
      
      setFiles(validFiles);
      setResults([]);
      setErrors([]);
      setSuccessCount(0);
      setProgress(0);
    }
  };

  const startConversion = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setResults([]);
    setErrors([]);
    setSuccessCount(0);
    setProgress(0);

    const newResults: ConversionResult[] = [];
    let currentSuccess = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await convertHeic(file, { format, quality });
        newResults.push(result);
        currentSuccess++;
        setSuccessCount(currentSuccess);
      } catch (err) {
        setErrors(prev => [...prev, (err as Error).message]);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setResults(newResults);
    setIsConverting(false);
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setErrors([]);
    setSuccessCount(0);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="container">
      <header>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ margin: 0 }}>HEIC Converter</h1>
          <select 
            value={i18n.language} 
            onChange={changeLanguage}
            style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="en">English</option>
            <option value="zh-TW">繁體中文</option>
          </select>
        </div>
      </header>

      <main className="controls">
        <div className="control-group">
          <label>{t("select_files")}</label>
          <div 
            className="file-input-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            {files.length > 0 
              ? t("files_selected", { count: files.length })
              : t("drop_hint")
            }
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple 
              accept=".heic,.heif"
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="settings">
          <div className="control-group">
            <label htmlFor="format">{t("output_format")}</label>
            <select 
              id="format"
              value={format} 
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              disabled={isConverting}
            >
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>

          {format === "image/jpeg" && (
            <div className="control-group">
              <label htmlFor="quality">{t("jpg_quality", { quality: quality.toFixed(1) })}</label>
              <input 
                id="quality"
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                value={quality} 
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                disabled={isConverting}
              />
            </div>
          )}
        </div>

        <div className="actions">
          <button 
            onClick={startConversion} 
            disabled={files.length === 0 || isConverting}
          >
            {isConverting ? t("converting") : t("convert_button", { count: files.length })}
          </button>
          <button 
            onClick={clearAll} 
            disabled={isConverting || (files.length === 0 && results.length === 0)}
            style={{ marginLeft: "1rem", backgroundColor: "#6c757d" }}
          >
            {t("clear")}
          </button>
        </div>

        {(isConverting || progress > 0) && (
          <div className="progress-area">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="status-summary">
              {progress === 100 && !isConverting 
                ? t("complete_summary", { success: successCount, failed: errors.length })
                : t("processing", { progress })
              }
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="errors-list">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <ul className="results-list">
            {results.map((result, index) => (
              <li key={index} className="result-item">
                <span className="result-name">{result.name}</span>
                <a 
                  href={result.url} 
                  download={result.name} 
                  className="download-link"
                >
                  {t("download")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
        <p>
          Made by <a href="https://kageryo.coderyo.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Chien-Hsun Chang</a> With ♥, MIT License
        </p>
      </footer>
    </div>
  );
}

export default App;
