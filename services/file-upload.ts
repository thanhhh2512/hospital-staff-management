export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export const validateFile = (file: File): void => {
  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError("File size exceeds 5MB limit");
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new FileValidationError(
      "Invalid file type. Only JPEG, PNG, WebP and PDF files are allowed"
    );
  }
};

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  try {
    validateFile(file);

    // For now, we'll create a local URL for the file
    // In a real application, this would upload to a server/cloud storage
    const url = URL.createObjectURL(file);

    return {
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    throw new Error("Failed to upload file");
  }
};
