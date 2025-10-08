export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; 


export function validateFile(
    file: File,
    allowedTypes: string[] = ALLOWED_DOCUMENT_TYPES,
    maxSize: number = MAX_FILE_SIZE
): FileValidationResult {
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
        };
    }

    if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes
            .map(type => type.split('/')[1])
            .join(', ');
        return {
            isValid: false,
            error: `File type not allowed. Allowed types: ${allowedExtensions}`,
        };
    }

    return { isValid: true };
}


export function validateImageFile(file: File): FileValidationResult {
    return validateFile(file, ALLOWED_IMAGE_TYPES);
}

export function validateDocumentFile(file: File): FileValidationResult {
    return validateFile(file, ALLOWED_DOCUMENT_TYPES);
}


export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 100);
}


export function createFilePreview(file: File): string {
    return URL.createObjectURL(file);
}

export function revokeFilePreview(url: string): void {
    URL.revokeObjectURL(url);
}


export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(file: File | string): string {
    const filename = typeof file === 'string' ? file : file.name;
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function isImageFile(file: File): boolean {
    return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
}