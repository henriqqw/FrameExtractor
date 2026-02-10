document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectFileBtn = document.getElementById('select-file-btn');
    const processingArea = document.getElementById('processing-area');
    const resultArea = document.getElementById('result-area');
    const videoElement = document.getElementById('video-element');
    const fileNameSpan = document.getElementById('file-name');
    const videoDurationSpan = document.getElementById('video-duration');
    const videoDimensionsSpan = document.getElementById('video-dimensions');
    const extractBtn = document.getElementById('extract-btn');
    const hiddenCanvas = document.getElementById('hidden-canvas');
    const ctx = hiddenCanvas.getContext('2d');
    const formatSelect = document.getElementById('format-select');
    const resultContent = document.getElementById('result-content');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Controls
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const allFramesOptions = document.getElementById('all-frames-options');
    const fpsSlider = document.getElementById('fps-slider');
    const fpsValue = document.getElementById('fps-value');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    // State
    let currentFile = null;
    let mode = 'first'; // 'first' or 'all'
    let generatedBlob = null;
    let generatedFilename = '';

    // Event Listeners

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // File Input
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Reseting
    resetBtn.addEventListener('click', () => {
        location.reload();
    });

    // Mode Toggle
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mode = btn.dataset.mode;

            if (mode === 'all') {
                allFramesOptions.classList.remove('hidden');
                extractBtn.textContent = 'Extract All Frames (ZIP)';
            } else {
                allFramesOptions.classList.add('hidden');
                extractBtn.textContent = 'Extract Frame';
            }
        });
    });

    // FPS Slider
    fpsSlider.addEventListener('input', (e) => {
        fpsValue.textContent = `${e.target.value} FPS`;
    });

    // Extract Button
    extractBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        startProcessing();

        try {
            if (mode === 'first') {
                await extractFirstFrame();
            } else {
                await extractAllFrames();
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during extraction: ' + error.message);
            stopProcessing();
        }
    });

    // Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (generatedBlob) {
                saveAs(generatedBlob, generatedFilename);
            }
        });
    }

    // Functions

    function handleFile(file) {
        if (!file.type.startsWith('video/')) {
            alert('Please upload a valid video file.');
            return;
        }

        currentFile = file;

        // Update UI
        dropZone.classList.add('hidden');
        processingArea.classList.remove('hidden');

        // Load info
        fileNameSpan.textContent = file.name;

        const url = URL.createObjectURL(file);
        videoElement.src = url;

        videoElement.onloadedmetadata = () => {
            videoDurationSpan.textContent = formatTime(videoElement.duration);
            videoDimensionsSpan.textContent = `${videoElement.videoWidth}x${videoElement.videoHeight}`;

            // Set canvas size
            hiddenCanvas.width = videoElement.videoWidth;
            hiddenCanvas.height = videoElement.videoHeight;
        };
    }

    async function extractFirstFrame() {
        const format = formatSelect.value;
        const ext = format === 'image/png' ? 'png' : 'jpeg';

        // Seek to 0
        const seekPromise = waitForSeek(videoElement);
        videoElement.currentTime = 0;
        await seekPromise;

        // Draw
        ctx.drawImage(videoElement, 0, 0);

        // Convert to Blob
        generatedBlob = await new Promise(resolve => hiddenCanvas.toBlob(resolve, format, 0.95));
        generatedFilename = `frame_0.${ext}`;

        // Show Result
        showResultImage(generatedBlob);
        stopProcessing();
    }

    async function extractAllFrames() {
        const format = formatSelect.value;
        const ext = format === 'image/png' ? 'png' : 'jpeg';
        const fps = parseFloat(fpsSlider.value);
        const duration = videoElement.duration;
        const interval = 1 / fps; // seconds per frame

        const zip = new JSZip();
        // Remove spaces and special chars from folder name to avoid issues
        const safeName = currentFile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const rootFolder = zip.folder(`frames_${safeName}`);

        let count = 0;

        // processing
        while (true) {
            const currentTime = count * interval;
            if (currentTime > duration) break;

            const seekPromise = waitForSeek(videoElement);
            videoElement.currentTime = currentTime;
            await seekPromise;

            ctx.drawImage(videoElement, 0, 0);
            const blob = await new Promise(resolve => hiddenCanvas.toBlob(resolve, format, 0.8));

            const timeStr = currentTime.toFixed(2).replace('.', '_');
            rootFolder.file(`frame_${count.toString().padStart(4, '0')}_${timeStr}s.${ext}`, blob);

            count++;

            // Update progress
            const percent = (currentTime / duration) * 100;
            updateProgress(Math.min(percent, 100), `Processing frame ${count}...`);

            await new Promise(r => setTimeout(r, 0));
        }

        updateProgress(100, 'Zipping files...');

        // Generate ZIP
        generatedBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
            updateProgress(metadata.percent, `Zipping... ${metadata.percent.toFixed(0)}%`);
        });

        generatedFilename = `${currentFile.name}_frames.zip`;

        showResultDownload();
        stopProcessing();
    }

    function waitForSeek(video) {
        return new Promise(resolve => {
            const onSeek = () => {
                video.removeEventListener('seeked', onSeek);
                resolve();
            };
            video.addEventListener('seeked', onSeek);
        });
    }

    function updateProgress(percent, text) {
        progressFill.style.width = `${percent}%`;
        if (text) progressText.textContent = text;
    }

    function startProcessing() {
        extractBtn.disabled = true;
        progressContainer.classList.remove('hidden');
        resultArea.classList.add('hidden');

        // Disable controls
        toggleBtns.forEach(b => b.disabled = true);
        formatSelect.disabled = true;
        fpsSlider.disabled = true;
    }

    function stopProcessing() {
        extractBtn.disabled = false;
        progressContainer.classList.add('hidden');
        progressFill.style.width = '0%';

        // Enable controls
        toggleBtns.forEach(b => b.disabled = false);
        formatSelect.disabled = false;
        fpsSlider.disabled = false;
    }

    function showResultImage(blob) {
        resultArea.classList.remove('hidden');
        const url = URL.createObjectURL(blob);
        resultContent.innerHTML = `<img src="${url}" class="result-preview-img" alt="Extracted Frame">`;

        // Scroll to result
        resultArea.scrollIntoView({ behavior: 'smooth' });
    }

    function showResultDownload() {
        resultArea.classList.remove('hidden');
        resultContent.innerHTML = `
             <div style="text-align:center; padding:1rem;">
                <p style="font-size:1.1rem; font-weight:600; color:var(--macos-text-primary);">ZIP Archive Ready</p>
                <p style="color:var(--macos-text-secondary); margin-top:0.5rem;">${(generatedBlob.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        `;

        // Scroll to result
        resultArea.scrollIntoView({ behavior: 'smooth' });
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
});
