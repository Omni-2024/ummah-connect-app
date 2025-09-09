import { cn } from "@/lib/className";
import { Gallery } from "iconsax-react";
import { Upload, X, Trash, File } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadWidgetProps {
  onFileUploaded: (file: File) => void;
  onFileRemoved: () => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  isUploading: boolean;
  isDeleting?: boolean;
  imageUrl?: string;
  error?: string;
}

export default function FileUploadWidget({
  onFileUploaded,
  onFileRemoved,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  },
  className = "",
  isUploading,
  isDeleting,
  imageUrl,
  error: _error,
}: FileUploadWidgetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileUploaded(selectedFile);
      }
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: isUploading || isDeleting,
  });

  const removeFile = useCallback(() => {
    if (!isUploading && !isDeleting) {
      onFileRemoved();
      setFile(null);
    }
  }, [onFileRemoved, isUploading, isDeleting]);

  const hasImage = !!imageUrl;
  const fileType = accept["image/*"] ? "image" : "file";

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "w-full border border-dashed border-dark-100 flex justify-center items-center rounded-xl cursor-pointer hover:bg-primary-50 active:bg-primary-100/60 transition-colors duration-500 relative",
          isDragActive && "bg-primary-50",
          (isUploading || isDeleting) && "cursor-not-allowed opacity-50",
          fileType === "image" ? "min-h-64" : "min-h-20"
        )}
        style={
          hasImage
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <input {...getInputProps()} disabled={isUploading || isDeleting} />
        {isUploading ? (
          <div className="bg-primary-500 text-white rounded-full px-4 py-2 flex items-center gap-2">
            <Upload className="w-5 h-5 animate-bounce" />
            Uploading...
          </div>
        ) : isDeleting ? (
          <div className="bg-red-500 text-white rounded-full px-4 py-2 flex items-center gap-2">
            <Trash className="w-5 h-5 animate-bounce" />
            Deleting...
          </div>
        ) : file || imageUrl ? (
          <div className="text-dark-300 font-medium flex items-center gap-3 select-none bg-white bg-opacity-70 px-4 py-2 rounded">
            {fileType === "image" ? (
              <Gallery className="w-5 h-5" />
            ) : (
              <File className="w-5 h-5" />
            )}
            {file ? file.name : `${fileType} selected`}
          </div>
        ) : (
          <div className="text-dark-300 font-medium flex items-center gap-3 select-none">
            <Gallery className="w-5 h-5" />
            Select or drag & drop {fileType} here
          </div>
        )}
        {hasImage && !isUploading && !isDeleting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Remove file"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      {(error || _error) && (
          <p className="text-red-500 mt-2 text-sm">{error ?? _error}</p>
      )}
    </div>
  );
}
