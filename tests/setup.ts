import '@testing-library/jest-dom';
import 'vitest-canvas-mock';
import { vi } from 'vitest';

// Mock URL.createObjectURL and URL.revokeObjectURL
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'mock-url');
  window.URL.revokeObjectURL = vi.fn();
}

// Mock Worker
class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  
  postMessage(data: any) {
    // Simulate successful worker response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({
          data: {
            success: true,
            blob: new Blob(['mock-data'], { type: data.format }),
            name: data.file.name.replace(/\.(heic|heif)$/i, data.format === 'image/jpeg' ? '.jpg' : '.png')
          }
        } as MessageEvent);
      }
    }, 0);
  }
  
  terminate() {}
}

vi.stubGlobal('Worker', MockWorker);
