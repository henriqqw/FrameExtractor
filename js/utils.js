
/**
 * Utility functions for EasyWebP Converter
 */

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateCompressionRatio(originalSize, convertedSize) {
    return ((originalSize - convertedSize) / originalSize) * 100;
}

export function isImageFile(file) {
    const supportedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/bmp',
        'image/tiff',
        'image/webp'
    ];
    return supportedFormats.includes(file.type);
}

export function validateFile(file) {
    if (!isImageFile(file)) {
        return {
            isValid: false,
            error: 'File is not a supported image format. Please upload JPG, PNG, BMP, TIFF, or WebP files.'
        };
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
        return {
            isValid: false,
            error: 'File size is too large. Please upload files smaller than 50MB.'
        };
    }

    return { isValid: true };
}
