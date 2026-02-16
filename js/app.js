


class FrameXtractor {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.videoLoaded = false;
    }

    initElements() {
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.selectBtn = document.getElementById('select-file-btn');
        this.video = document.getElementById('video-element');
        this.processingArea = document.getElementById('processing-area');
        this.extractBtn = document.getElementById('extract-btn');
        this.canvas = document.getElementById('hidden-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.downloadBtn = document.getElementById('download-btn');
        this.resultArea = document.getElementById('result-area');
        this.resultContent = document.getElementById('result-content');
        this.resetBtn = document.getElementById('reset-btn');
    }

    bindEvents() {
        if (this.selectBtn) this.selectBtn.addEventListener('click', () => this.fileInput.click());
        if (this.fileInput) this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        if (this.dropZone) {
            this.dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.dropZone.classList.add('drag-over');
            });
            this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
            this.dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.dropZone.classList.remove('drag-over');
                if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
            });
        }

        if (this.extractBtn) this.extractBtn.addEventListener('click', () => this.extractFrame());
        if (this.resetBtn) this.resetBtn.addEventListener('click', () => {
            location.reload();
        });

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => {
                const img = this.resultContent.querySelector('img');
                if (img) {
                    const a = document.createElement('a');
                    a.href = img.src;
                    a.download = `frame_${Date.now()}.png`; // Simple download for now
                    a.click();
                }
            });
        }
    }

    handleFileSelect(e) {
        if (e.target.files.length) this.handleFile(e.target.files[0]);
    }

    handleFile(file) {
        // Check MIME type or extension (fallback for Windows where type might be empty)
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|mkv|avi)$/i.test(file.name);

        if (!isVideo) {
            alert('Please select a valid video file.\nDetected type: ' + (file.type || 'unknown') + '\nFile: ' + file.name);
            console.error('Invalid file type:', file.type, file.name);
            return;
        }

        const url = URL.createObjectURL(file);

        // Reset previous error handlers/states
        this.video.onerror = null;

        // Set up event handlers before setting src
        this.video.onloadedmetadata = () => {
            this.videoLoaded = true;
            document.getElementById('file-name').textContent = file.name;
            document.getElementById('video-duration').textContent = this.formatTime(this.video.duration);
            document.getElementById('video-dimensions').textContent = `${this.video.videoWidth}x${this.video.videoHeight}`;
            console.log('Video metadata loaded');
        };

        this.video.onerror = (e) => {
            console.error('Error loading video:', this.video.error);
            alert('Error loading video file. The format might not be supported by your browser.');
            this.processingArea.classList.add('hidden');
            document.getElementById('drop-zone').classList.remove('hidden');
        };

        this.video.src = url;
        this.processingArea.classList.remove('hidden');
        document.getElementById('drop-zone').classList.add('hidden'); // Hide upload area
    }

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    extractFrame() {
        if (!this.videoLoaded || !this.ctx) return;

        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        const dataUrl = this.canvas.toDataURL('image/png');

        this.resultContent.innerHTML = `<img src="${dataUrl}" style="max-width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3);">`;
        this.resultArea.classList.remove('hidden');
        this.resultArea.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FrameXtractor();
});
