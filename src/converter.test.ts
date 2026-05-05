import { describe, it, expect } from 'vitest';
import { convertHeic } from './converter';

describe('converter logic', () => {
  it('should convert heic to jpg name correctly', async () => {
    const file = new File([''], 'test.heic', { type: 'image/heic' });
    const result = await convertHeic(file, { format: 'image/jpeg', quality: 0.9 });
    
    expect(result.name).toBe('test.jpg');
    expect(result.url).toBe('mock-url');
  });

  it('should convert heic to png name correctly', async () => {
    const file = new File([''], 'test.heif', { type: 'image/heif' });
    const result = await convertHeic(file, { format: 'image/png' });
    
    expect(result.name).toBe('test.png');
  });
});
