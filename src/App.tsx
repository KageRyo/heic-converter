import { useState, useRef } from "react";
import "./App.css";
import { convertHeic } from "./converter";
import type { OutputFormat, ConversionResult } from "./converter";

function App() {
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
        setErrors(prev => [...prev, `${invalidCount} unsupported files skipped. Only .heic and .heif are supported.`]);
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

  return (
    <div className="container">
      <header>
        <h1>HEIC Converter</h1>
        <div className="privacy-note">
          <strong>Privacy First:</strong> All conversions happen locally in your browser. No images are uploaded to any server.
        </div>
      </header>

      <main className="controls">
        <div className="control-group">
          <label>Select HEIC/HEIF Files</label>
          <div 
            className="file-input-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            {files.length > 0 
              ? `${files.length} file(s) selected` 
              : "Click to select or drag and drop .heic / .heif files"
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
            <label htmlFor="format">Output Format</label>
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
              <label htmlFor="quality">JPG Quality: {quality.toFixed(1)}</label>
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
            {isConverting ? "Converting..." : `Convert ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
          <button 
            onClick={clearAll} 
            disabled={isConverting || (files.length === 0 && results.length === 0)}
            style={{ marginLeft: "1rem", backgroundColor: "#6c757d" }}
          >
            Clear
          </button>
        </div>

        {(isConverting || progress > 0) && (
          <div className="progress-area">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="status-summary">
              {progress === 100 && !isConverting 
                ? `Conversion complete: ${successCount} successful, ${errors.length} failed`
                : `Processing... ${progress}%`
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
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
        <p>Built with privacy in mind. Powered by WASM.</p>
      </footer>
    </div>
  );
}

export default App;
