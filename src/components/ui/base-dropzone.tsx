import { useDropzone } from "react-dropzone";
import { useState } from "react";

interface BaseDropzoneProps {
  accept: Record<string, string[]>;
  maxFiles?: number;
  onFileDrop: (file: File) => void;
}

export function BaseDropzone({
  accept,
  maxFiles = 1,
  onFileDrop,
}: BaseDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      onFileDrop(file);
      simulateUpload(file);
    },
    accept,
    maxFiles,
  });

  const simulateUpload = (file: File) => {
    setUploadStatus("uploading");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("success");
      }
    }, 500);
  };

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    uploadProgress,
    uploadStatus,
  };
}
