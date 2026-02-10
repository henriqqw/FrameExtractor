'use client'

import { useState, useRef, useEffect } from 'react'
import JSZip from 'jszip'
import { formatFileSize, calculateCompressionRatio, isImageFile, validateFile } from '@/utils/imageConverter'
import Navigation from '@/components/Navigation'

// FeatureCard component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
)

// FileItem component
const FileItem = ({ file, index, onRemove }: { file: File; index: number; onRemove: (index: number) => void }) => (
  <div className="file-item">
    <div className="file-info">
      <svg className="file-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <div className="file-details">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatFileSize(file.size)}</div>
      </div>
    </div>
    <button className="remove-file" onClick={() => onRemove(index)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
)

// DetailItem component
const DetailItem = ({ convertedImage, index, onDownload }: { convertedImage: any; index: number; onDownload: (image: any) => void }) => (
  <div className="detail-item">
    <div className="detail-info">
      <svg className="detail-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <div className="detail-text">
        <div className="detail-name">{convertedImage.fileName}</div>
        <div className="detail-stats">
          <span>{formatFileSize(convertedImage.originalSize)} → {formatFileSize(convertedImage.convertedSize)}</span>
          <span className="compression-percent">-{Math.round(convertedImage.compressionRatio)}%</span>
        </div>
      </div>
    </div>
    <div className="detail-actions">
      <button className="macos-button secondary" onClick={() => onDownload(convertedImage)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </div>
  </div>
)

// SummaryCard component
const SummaryCard = ({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => (
  <div className="summary-card">
    <div className="summary-icon">{icon}</div>
    <div className="summary-content">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
)

export default function Home() {
  // State management
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [convertedImages, setConvertedImages] = useState<any[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAreaRef = useRef<HTMLDivElement>(null)

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.add('drag-over')
    }
  }

  const handleDragLeave = () => {
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over')
    }
    if (e.dataTransfer.files.length) {
      const files = e.dataTransfer.files;
      const newFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach(file => {
        const validation = validateFile(file);
        if (validation.isValid) {
          newFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      });

      if (errors.length > 0) {
        alert('Some files could not be added:\n' + errors.join('\n'));
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  }

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Clear all files
  const clearAllFiles = () => {
    setSelectedFiles([])
  }

  // Convert images to WebP with 100% quality and original aspect ratio
  const convertImages = async () => {
    if (selectedFiles.length === 0) return

    setIsConverting(true)
    setConversionProgress(0)
    try {
      const converted: any[] = []
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const result = await convertImageToWebP(file)
        converted.push(result)
        // Update progress
        setConversionProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      }
      setConvertedImages(converted)
      setShowResults(true)
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Conversion failed. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  // Convert a single image to WebP with 100% quality and original dimensions
  const convertImageToWebP = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      const img = new Image()
      img.onload = () => {
        try {
          let { width, height } = img

          // Use original dimensions to maintain 100% quality and aspect ratio
          canvas.width = width
          canvas.height = height

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create WebP blob'))
                return
              }

              const originalName = file.name
              const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'))
              const fileName = `${nameWithoutExtension}.webp`

              const originalSize = file.size
              const convertedSize = blob.size
              const compressionRatio = calculateCompressionRatio(originalSize, convertedSize)

              resolve({
                originalFile: file,
                convertedBlob: blob,
                originalSize,
                convertedSize,
                compressionRatio,
                fileName
              })
            },
            'image/webp',
            0.85 // 85% quality - good balance between quality and file size
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      reader.readAsDataURL(file)
    })
  }

  // Download single file
  const downloadSingle = (convertedImage: any) => {
    const url = URL.createObjectURL(convertedImage.convertedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = convertedImage.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download all files
  const downloadAll = async () => {
    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0])
      return
    }

    // Show loading state
    const downloadButton = document.querySelector('.results-actions .macos-button.primary');
    if (downloadButton) {
      downloadButton.classList.add('loading');
    }

    // Create a ZIP archive for multiple files
    try {
      const zip = new JSZip()
      
      // Add all converted images to the ZIP
      for (const image of convertedImages) {
        const blob = image.convertedBlob
        zip.file(image.fileName, blob)
      }
      
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Create download link
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'easywebp.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to create ZIP archive:', error)
      alert('Failed to create ZIP archive. Please try downloading files individually.')
      
      // Fallback to individual downloads with delay
      convertedImages.forEach((image, index) => {
        setTimeout(() => {
          downloadSingle(image)
        }, index * 500)
      })
    } finally {
      // Remove loading state
      if (downloadButton) {
        downloadButton.classList.remove('loading');
      }
    }
  }

  // Convert more files
  const convertMore = () => {
    setShowResults(false)
    setSelectedFiles([])
    setConvertedImages([])
  }

  // Scroll to results when they appear
  useEffect(() => {
    if (showResults) {
      const resultsSection = document.getElementById('resultsSection')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [showResults])

  // Calculate summary statistics
  const totalOriginalSize = convertedImages.reduce((sum, img) => sum + (img.originalSize || 0), 0)
  const totalConvertedSize = convertedImages.reduce((sum, img) => sum + (img.convertedSize || 0), 0)
  const totalSavings = totalOriginalSize - totalConvertedSize
  const averageCompressionRatio = convertedImages.length > 0 ? convertedImages.reduce((sum, img) => sum + (img.compressionRatio || 0), 0) / convertedImages.length : 0

  return (
    <div className="app-container">
      <Navigation />
      <header className="app-header">
        <h1>EasyWebp Converter</h1>
        <p>Convert your images to WebP format 100% FREE with ease</p>
      </header>

      <main className="app-main gradient-footer">
        {/* Features Section */}
        <section className="features-section">
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            }
            title="Fast & Easy"
            description="Convert multiple images simultaneously and download individual files or get everything in a convenient archive"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            }
            title="Privacy First"
            description="All processing happens in your browser. Your files never leave your device"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 8l-4 4-4-4"></path>
                <path d="M16 16l-4-4-4 4"></path>
              </svg>
            }
            title="100% Free"
            description="Completely free to use with no hidden fees, subscriptions, or watermarks"
          />
        </section>

        {/* Conversion Interface */}
        {!showResults ? (
          <section className="conversion-section">
            <div 
              className="upload-area" 
              ref={uploadAreaRef}
              onClick={(e) => {
                // Only trigger file input click if the click wasn't on a button
                if (e.target === uploadAreaRef.current || e.target === uploadAreaRef.current?.firstChild) {
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <h3>Drag & drop images here</h3>
                <p>or click to select files</p>
                <p className="file-info">Supported formats: JPG, PNG, BMP, TIFF, WebP</p>
                <p className="file-info">Maximum file size: 50MB</p>
                <button className="macos-button primary" onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}>
                  Select Files
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    const files = e.target.files;
                    const newFiles: File[] = [];
                    const errors: string[] = [];

                    Array.from(files).forEach(file => {
                      const validation = validateFile(file);
                      if (validation.isValid) {
                        newFiles.push(file);
                      } else {
                        errors.push(`${file.name}: ${validation.error}`);
                      }
                    });

                    if (errors.length > 0) {
                      alert('Some files could not be added:\n' + errors.join('\n'));
                    }

                    setSelectedFiles(prev => [...prev, ...newFiles]);
                    
                    // Reset file input to allow selecting the same files again
                    e.target.value = '';
                  }
                }}
              />
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <div className="files-header">
                  <h3>Selected Files (<span id="fileCount">{selectedFiles.length}</span>)</h3>
                  <button className="macos-button secondary" onClick={clearAllFiles}>Clear All</button>
                </div>
                <div className="files-list">
                  {selectedFiles.map((file, index) => (
                    <FileItem key={index} file={file} index={index} onRemove={removeFile} />
                  ))}
                </div>
              </div>
            )}

            {/* Convert Button */}
            {selectedFiles.length > 0 && (
              <div className="convert-button-container">
                <button 
                  className="macos-button primary large" 
                  onClick={convertImages}
                  disabled={isConverting}
                >
                  <span className="button-text">
                    {isConverting ? 'Converting...' : 'Convert to WebP'}
                  </span>
                  {isConverting && <span className="spinner"></span>}
                </button>
                {isConverting && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${conversionProgress}%` }}></div>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          /* Results Section */
          <section className="results-section" id="resultsSection">
            <div className="results-summary">
              <SummaryCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                }
                value={convertedImages.length}
                label="Files Converted"
              />
              
              {/* How to Use Card - Simple and Objective */}
              <div className="summary-card">
                <div className="summary-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="summary-content">
                  <h3>How to Use</h3>
                  <p>Click download buttons or "Download All Files" below</p>
                </div>
              </div>
            </div>

            <div className="conversion-details">
              <h3>Conversion Details</h3>
              <div className="details-list">
                {convertedImages.map((image, index) => (
                  <DetailItem 
                    key={index} 
                    convertedImage={image} 
                    index={index} 
                    onDownload={downloadSingle} 
                  />
                ))}
              </div>
            </div>

            {/* Action buttons moved below conversion details */}
            <div className="results-actions">
              <button className="macos-button primary" onClick={downloadAll}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download All Files
              </button>
              <button className="macos-button secondary" onClick={convertMore}>Convert More Files</button>
            </div>
          </section>
        )}
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