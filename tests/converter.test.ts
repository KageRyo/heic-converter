import { afterEach, describe, it, expect, vi } from 'vitest';
import { convertHeic } from '../src/converter';

afterEach(() => vi.unstubAllGlobals());

describe('conversion worker communication', () => {
  it('forwards conversion options and returns the worker output', async () => {
    const worker = {
      onmessage: null as ((event: MessageEvent) => void) | null,
      onerror: null as ((event: ErrorEvent) => void) | null,
      postMessage: vi.fn(),
      terminate: vi.fn(),
    };
    vi.stubGlobal('Worker', vi.fn(function () { return worker; }));
    const file = new File([''], 'input.heic', { type: 'image/heic' });
    const blob = new Blob(['worker output'], { type: 'image/jpeg' });
    const conversion = convertHeic(file, { format: 'image/jpeg', quality: 0.9 });

    expect(worker.postMessage).toHaveBeenCalledWith({
      file, format: 'image/jpeg', quality: 0.9,
    });
    worker.onmessage!({
      data: { success: true, blob, name: 'worker-selected-name.jpg' },
    } as MessageEvent);

    expect(await conversion).toEqual({
      blob, name: 'worker-selected-name.jpg', url: 'mock-url',
    });
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});
