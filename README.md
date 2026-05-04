# heic-converter

A privacy-friendly browser-based HEIC/HEIF to JPG/PNG converter.

## Features

- Convert HEIC/HEIF images to JPG or PNG
- Batch conversion support
- 100% client-side processing
- No image upload
- JPG quality control
- GitHub Pages ready

## Privacy Note

This app performs all image conversion locally in your browser. Your images are never uploaded to a server.

## Tech Stack

- **Vite**: Build tool and dev server
- **React**: UI framework
- **TypeScript**: Static typing
- **heic2any**: HEIC/HEIF decoder (WASM-based)
- **GitHub Actions**: Automated deployment

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Build

To build the project for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## GitHub Pages Deployment

The app is configured for GitHub Pages. 

1. Ensure the `base` in `vite.config.ts` matches your repository name (default is `/heic-converter/`).
2. Push your changes to the `main` branch.
3. GitHub Actions will automatically build and deploy the app.

## Known Limitations

- Large images may take time or use a lot of memory due to browser-side processing.
- Metadata such as EXIF/GPS may not be fully preserved.
- Browser performance may vary depending on the hardware and complexity of the image.
- HEIC decoding depends on the `heic2any` library and WASM performance.

## License

MIT
