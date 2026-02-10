'use client'

import Navigation from '@/components/Navigation'

export default function HowToUse() {
  return (
    <div className="app-container">
      <Navigation />
      <header className="app-header">
        <h1>How To Use EasyWebp Converter</h1>
        <p>Learn how to convert your images to WebP format in just a few simple steps</p>
      </header>

      <main className="app-main gradient-footer">
        <section className="instructions-section">
          <div className="instructions-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Your Images
              </h3>
              <p>Drag and drop your images onto the upload area or click the "Select Files" button to choose images from your device. We support JPG, PNG, BMP, TIFF, and WebP formats.</p>
            </div>
          </div>

          <div className="instructions-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Convert to WebP
              </h3>
              <p>Click the "Convert to WebP" button. Our tool will automatically convert your images to the WebP format while maintaining 100% quality and original dimensions.</p>
            </div>
          </div>

          <div className="instructions-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Your Files
              </h3>
              <p>After conversion, you can download individual files by clicking the download button next to each file, or click "Download All Files" to get a ZIP archive containing all your converted images.</p>
            </div>
          </div>
        </section>

        <section className="tips-section">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Helpful Tips
          </h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                WebP Benefits
              </h3>
              <p>WebP images are typically 25-35% smaller than JPEG images with the same quality, resulting in faster loading websites.</p>
            </div>
            <div className="tip-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Browser Support
              </h3>
              <p>WebP is supported by all modern browsers including Chrome, Firefox, Safari, and Edge.</p>
            </div>
            <div className="tip-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Privacy First
              </h3>
              <p>All processing happens in your browser. Your images never leave your device, ensuring complete privacy.</p>
            </div>
            <div className="tip-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Batch Conversion
              </h3>
              <p>You can convert multiple images at once. There's no limit to how many files you can process in a single session.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>EasyWebp Converter - Convert images to WebP format 100% FREE with ease</p>
        <p className="footer-note">Made with <span className="heart">❤️</span> by chaostec</p>
        <div className="social-links">
          <a href="https://github.com/henriqqw" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.instagram.com/henriqqw/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://x.com/chaosphory" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="mailto:lanzonicmpny13@gmail.com">Email</a>
        </div>
      </footer>
    </div>
  )
}