'use client'

import Navigation from '@/components/Navigation'
import styles from './page.module.css'

export default function About() {
  return (
    <div className="app-container">
      <Navigation />
      <header className="app-header">
        <h1>About EasyWebp Converter</h1>
        <p>Learn more about our tool and the technology behind it</p>
      </header>

      <main className="app-main gradient-footer">
        <section className={styles.aboutSection}>
          <div className={styles.aboutCard}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Our Mission
            </h2>
            <p>EasyWebp Converter was created to make image optimization accessible to everyone. We believe that powerful image compression tools should be <strong>100% free</strong>, private, and easy to use.</p>
          </div>
          
          <div className={styles.aboutCard}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Why WebP?
            </h2>
            <p>WebP is a modern image format developed by Google that provides superior compression for images on the web. Compared to JPEG and PNG, WebP images are significantly smaller while maintaining the same visual quality.</p>
          </div>
          
          <div className={styles.aboutCard}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Privacy Focused
            </h2>
            <p>Unlike many online converters, EasyWebp Converter processes all images directly in your browser. This means your images never leave your device, ensuring complete privacy and security.</p>
          </div>
          
          <div className={styles.aboutCard}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Open Source
            </h2>
            <p>EasyWebp Converter is built with open-source technologies and is continuously improved by our community. Check out our GitHub repository to see the code, report issues, or contribute.</p>
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