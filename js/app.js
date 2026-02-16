
/**
 * FrameXtractor Application Logic
 * Handles video loading, frame extraction, and UI interactions.
 */

class FrameXtractor {
    constructor() {
        this.state = {
            videoLoaded: false,
            extractionMode: 'first', // 'first' or 'all'
            frameMethod: 'fps', // 'fps' or 'total'
            resolutionMode: 'original', // 'original' or 'custom'
            fps: 1,
            outputFormat: 'image/png'
        };

        this.elements = {
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            selectBtn: document.getElementById('select-file-btn'),
            video: (() => {
                const v = document.getElementById('video-element');
                if (v) {
                    v.setAttribute('playsinline', '');
                    v.style.maxHeight = '60vh';
                }
                return v;
            })(),
            // Phase 6 Element
            videoContainer: document.querySelector('.video-preview-container'),

            processingArea: document.getElementById('processing-area'),
            extractBtn: document.getElementById('extract-btn'),
            stopBtn: document.getElementById('stop-btn'),
            resetBtn: document.getElementById('reset-btn'),
            downloadBtn: document.getElementById('download-btn'),
            canvas: document.getElementById('hidden-canvas'),
            resultArea: document.getElementById('result-area'),
            resultContent: document.getElementById('result-content'),
            progressContainer: document.getElementById('progress-container'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            fpsSlider: document.getElementById('fps-slider'),
            fpsValue: document.getElementById('fps-value'),
            formatSelect: document.getElementById('format-select'),
            toggleBtns: document.querySelectorAll('.toggle-btn[data-mode]'),
            allFramesOptions: document.getElementById('all-frames-options'),

            // Phase 3 Elements
            frameMethodToggles: document.querySelectorAll('.toggle-btn[data-method]'),
            fpsControls: document.getElementById('fps-controls'),
            totalFramesControls: document.getElementById('total-frames-controls'),
            totalFramesInput: document.getElementById('total-frames-input'),

            // Phase 4 Elements
            resolutionToggles: document.querySelectorAll('.toggle-btn[data-resolution]'),
            customResControls: document.getElementById('custom-resolution-controls'),
            customWidthInput: document.getElementById('custom-width-input'),

            videoInfo: {
                name: document.getElementById('file-name'),
                duration: document.getElementById('video-duration'),
                dimensions: document.getElementById('video-dimensions')
            }
        };

        this.ctx = this.elements.canvas ? this.elements.canvas.getContext('2d') : null;

        // Initialize Plyr if available
        if (typeof Plyr !== 'undefined') {
            this.player = new Plyr(this.elements.video, {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                ratio: null, // Adapt to video aspect ratio
                clickToPlay: true,
                hideControls: true,
                resetOnEnd: true,
                keyboard: { focused: true, global: true },
                tooltips: { controls: true, seek: true }
            });
        } else {
            console.error('Plyr library not loaded');
        }

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const { dropZone, fileInput, selectBtn, extractBtn, resetBtn, downloadBtn, fpsSlider, formatSelect, toggleBtns, frameMethodToggles, resolutionToggles } = this.elements;

        // File Selection
        selectBtn?.addEventListener('click', () => fileInput.click());
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and Drop
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => this.preventDefaults(e), false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
            });

            dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
        }

        // Controls
        extractBtn?.addEventListener('click', () => this.startExtraction());
        this.elements.stopBtn?.addEventListener('click', () => this.stopExtraction());
        resetBtn?.addEventListener('click', () => this.resetApp());

        // Settings
        fpsSlider?.addEventListener('input', (e) => this.updateFps(e.target.value));
        formatSelect?.addEventListener('change', (e) => this.state.outputFormat = e.target.value);

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setExtractionMode(e.target));
        });

        // Phase 3: Frame Method Toggle
        frameMethodToggles.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFrameMethod(e.target));
        });

        // Phase 4: Resolution Toggle
        resolutionToggles.forEach(btn => {
            btn.addEventListener('click', (e) => this.setResolutionMode(e.target));
        });

        // Resolution Preset Logic
        const widthPreset = document.getElementById('width-preset');
        const customWidthWrapper = document.getElementById('custom-width-wrapper');
        const customWidthInput = document.getElementById('custom-width-input');

        if (widthPreset && customWidthWrapper && customWidthInput) {
            widthPreset.addEventListener('change', (e) => {
                if (e.target.value === 'custom') {
                    customWidthWrapper.classList.remove('hidden');
                    customWidthInput.focus();
                } else {
                    customWidthWrapper.classList.add('hidden');
                    customWidthInput.value = e.target.value;
                }
            });
        }

        // Download
        downloadBtn?.addEventListener('click', () => this.downloadResult());
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) this.handleFile(files[0]);
    }

    handleFileSelect(e) {
        if (e.target.files.length) this.handleFile(e.target.files[0]);
    }

    handleFile(file) {
        if (!this.validateFile(file)) return;

        const url = URL.createObjectURL(file);
        this.loadVideo(url, file);
    }

    validateFile(file) {
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska', 'video/avi'];
        const isVideo = validTypes.includes(file.type) || file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|mkv|avi)$/i.test(file.name);

        if (!isVideo) {
            alert('Please select a valid video file (MP4, WebM, Ogg, MOV).');
            return false;
        }
        return true;
    }

    loadVideo(url, file) {
        const { video, processingArea, dropZone, videoInfo, videoContainer } = this.elements;

        // Reset state
        this.state.videoLoaded = false;
        this.elements.resultArea.classList.add('hidden');

        video.src = url;
        video.load();

        const onLoadedMetadata = () => {
            this.state.videoLoaded = true;
            videoInfo.name.textContent = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;

            // Update Info
            videoInfo.duration.textContent = this.formatTime(video.duration);
            videoInfo.dimensions.textContent = `${video.videoWidth}x${video.videoHeight}`;

            // Phase 6: Dynamic Aspect Ratio (Refined)
            // Ensures container matches video shape but respects max-height constraints
            if (videoContainer) {
                const ratio = video.videoWidth / video.videoHeight;
                videoContainer.style.aspectRatio = `${ratio}`;
                videoContainer.style.height = 'auto'; // Reset height
            }

            dropZone.classList.add('hidden');
            processingArea.classList.remove('hidden');

            video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };

        const onError = (e) => {
            console.error('Video Error:', e);
            alert('Error loading video. Please try a different file.');
            this.resetApp();
            video.removeEventListener('error', onError);
        }

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', onError);
    }

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    setExtractionMode(targetBtn) {
        const mode = targetBtn.dataset.mode;
        this.state.extractionMode = mode;

        this.elements.toggleBtns.forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        if (mode === 'all') {
            this.elements.allFramesOptions.classList.remove('hidden');
        } else {
            this.elements.allFramesOptions.classList.add('hidden');
        }
    }

    setFrameMethod(targetBtn) {
        const method = targetBtn.dataset.method;
        this.state.frameMethod = method;

        this.elements.frameMethodToggles.forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        if (method === 'total') {
            this.elements.fpsControls.classList.add('hidden');
            this.elements.totalFramesControls.classList.remove('hidden');
        } else {
            this.elements.fpsControls.classList.remove('hidden');
            this.elements.totalFramesControls.classList.add('hidden');
        }
    }

    setResolutionMode(targetBtn) {
        const mode = targetBtn.dataset.resolution;
        this.state.resolutionMode = mode;

        this.elements.resolutionToggles.forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        if (mode === 'custom') {
            this.elements.customResControls.classList.remove('hidden');
        } else {
            this.elements.customResControls.classList.add('hidden');
        }
    }

    updateFps(value) {
        this.state.fps = value;
        this.elements.fpsValue.textContent = `${value} FPS`;
    }

    calculateDimensions(video) {
        if (this.state.resolutionMode === 'original') {
            return { width: video.videoWidth, height: video.videoHeight };
        } else {
            let width = parseInt(this.elements.customWidthInput.value);
            if (!width || width < 10) width = 1920;
            if (width > 7680) width = 7680; // Cap at 8K

            const aspectRatio = video.videoWidth / video.videoHeight;
            const height = Math.round(width / aspectRatio);
            return { width, height };
        }
    }

    // Phase 5: Helper for non-blocking notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger reflow
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    async startExtraction() {
        if (!this.state.videoLoaded || !this.ctx) return;

        // Reset abort controller
        this.abortController = new AbortController();

        if (this.state.extractionMode === 'first') {
            this.extractSingleFrame();
        } else {
            await this.extractAllFrames();
        }
    }

    stopExtraction() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    async extractAllFrames() {
        const { video, canvas, fpsSlider, extractBtn, stopBtn, resetBtn, progressContainer, progressFill, progressText, totalFramesInput } = this.elements;

        let interval, totalFrames;
        const duration = video.duration;

        // Phase 3: Total Frames vs FPS Logic
        if (this.state.frameMethod === 'total') {
            totalFrames = parseInt(totalFramesInput.value) || 100;
            interval = duration / totalFrames;
        } else {
            const fps = parseFloat(fpsSlider.value);
            interval = 1 / fps;
            totalFrames = Math.floor(duration * fps);
        }

        // Phase 5: Auto-Optimize Guardrail
        if (totalFrames > 1000 && this.state.outputFormat === 'image/png') {
            // Auto-switch to JPEG to prevent memory crash
            this.state.outputFormat = 'image/jpeg';
            this.elements.formatSelect.value = 'image/jpeg';
            this.showToast('Switched to JPEG format for performance (High frame count)', 'info');
        }

        // Phase 4: Resolution Calculation
        const { width, height } = this.calculateDimensions(video);

        // Phase 5: Memory Heuristic Check
        // Estimate unwrapped raw pixel size in memory for ONE frame (approx 4 bytes/pixel)
        // Total memory churn is high, but browser GC helps. 
        // Real danger is ZIP size.
        const estimatedRawSizeMB = (width * height * 4) / (1024 * 1024);
        const estimatedTotalSizeMB = estimatedRawSizeMB * totalFrames;

        if (estimatedTotalSizeMB > 2000) { // > 2GB estimated raw
            if (!confirm(`Warning: High Memory Usage Detected.\nEstimated processing load: ~${(estimatedTotalSizeMB / 1024).toFixed(1)} GB.\nYour browser might crash. Continue?`)) {
                return;
            }
        } else if (totalFrames > 1000) {
            if (!confirm(`Warning: This will extract approximately ${totalFrames} frames. It might take a while. Continue?`)) {
                return;
            }
        }

        // UI Updates: Disable interactions
        extractBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        progressContainer.classList.remove('hidden');

        const zip = new JSZip();
        let extractedCount = 0;
        let currentTime = 0;
        let lastUIUpdate = 0;

        // Store original time to restore later
        const originalTime = video.currentTime;
        video.pause();

        try {
            // Optimization: Set canvas size once
            canvas.width = width;
            canvas.height = height;

            while (currentTime < duration) {
                // Check for cancellation
                if (this.abortController?.signal.aborted) {
                    throw new Error('Extraction prohibited by user.');
                }

                // 1. Seek
                video.currentTime = currentTime;

                // 2. Wait for seek (Promisified)
                await new Promise(resolve => {
                    const onSeek = () => {
                        video.removeEventListener('seeked', onSeek);
                        resolve();
                    };
                    video.addEventListener('seeked', onSeek, { once: true });
                });

                // 3. Yield to UI (Critical for performance)
                await new Promise(r => setTimeout(r, 0));

                // 4. Capture
                this.ctx.drawImage(video, 0, 0, width, height);

                // 5. Blob & Zip
                const blob = await new Promise(resolve => canvas.toBlob(resolve, this.state.outputFormat));
                const ext = this.state.outputFormat === 'image/jpeg' ? 'jpg' : 'png';
                const filename = `frame_${String(extractedCount).padStart(4, '0')}_${currentTime.toFixed(2)}s.${ext}`;

                zip.file(filename, blob);

                extractedCount++;

                // 6. Progress & Next Step (Throttled UI Update)
                const now = performance.now();
                if (now - lastUIUpdate > 100 || extractedCount === totalFrames || extractedCount % 5 === 0) {
                    const percent = Math.min((currentTime / duration) * 100, 100);
                    progressFill.style.width = `${percent}%`;
                    progressText.textContent = `Processing: ${extractedCount} / ~${totalFrames} frames`;
                    lastUIUpdate = now;
                }

                currentTime += interval;
            }

            // Finalize ZIP
            progressText.textContent = 'Generating ZIP...';
            // Yield once more before heavy zip generation
            await new Promise(r => setTimeout(r, 0));

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `frames_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.zip`);

            // Success UI
            this.elements.resultArea.classList.remove('hidden');
            this.elements.resultContent.innerHTML = `<p style="color:var(--success); text-align:center;">Successfully extracted ${extractedCount} frames to ZIP.</p>`;
            this.elements.resultArea.scrollIntoView({ behavior: 'smooth' });

        } catch (e) {
            console.warn('Extraction stopped:', e.message);
            progressText.textContent = 'Stopped.';
        } finally {
            // Restore UI
            stopBtn.classList.add('hidden');
            extractBtn.classList.remove('hidden');
            resetBtn.classList.remove('hidden');
            progressContainer.classList.add('hidden');

            // Restore Video State
            video.currentTime = originalTime;

            // Clear abort controller
            this.abortController = null;
        }
    }

    extractSingleFrame() {
        const { video, canvas, resultContent, resultArea } = this.elements;

        // Phase 4: Resolution Calculation
        const { width, height } = this.calculateDimensions(video);
        canvas.width = width;
        canvas.height = height;

        // Draw current video frame to canvas
        this.ctx.drawImage(video, 0, 0, width, height);

        try {
            const dataUrl = canvas.toDataURL(this.state.outputFormat);

            // Create Image Element
            const img = new Image();
            img.src = dataUrl;
            // Styles are handled in CSS (.result-content img) for clean code

            resultContent.innerHTML = '';
            resultContent.appendChild(img);

            resultArea.classList.remove('hidden');
            resultArea.scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            console.error('Extraction error:', e);
            alert('Failed to extract frame. Security constraints might be blocking this action. Ensure the video is from a CORS-enabled source if remote.');
        }
    }

    downloadResult() {
        // ... (Download single frame logic if needed, currently result area shows zip success or single image)
        const img = this.elements.resultContent.querySelector('img');
        if (img) {
            const ext = this.state.outputFormat === 'image/jpeg' ? 'jpg' : 'png';
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `frame_${Date.now()}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    resetApp() {
        location.reload();
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FrameXtractor();
});
