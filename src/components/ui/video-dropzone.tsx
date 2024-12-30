import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface VideoDropzoneProps {
  field: {
    value: File | null;
    onChange: (file: File | null) => void;
    onBlur: () => void;
    name: string;
  };
}

export function VideoDropzone({ field }: VideoDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const videoFile = acceptedFiles[0];
      if (videoFile) {
        field.onChange(videoFile);
        simulateUpload(videoFile);
      }
    },
    [field],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".wmv"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const simulateUpload = (file: File) => {
    setUploadStatus("uploading");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 50;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("success");
      }
    }, 500);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary",
      )}
    >
      <input {...getInputProps()} name={field.name} onBlur={field.onBlur} />
      {uploadStatus === "idle" && (
        <>
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="text-sm">Selecciona o arrastra un archivo de video</p>
          <p className="text-xs text-gray-500">
            Formatos soportados: MP4, MOV, AVI, WMV
          </p>
        </>
      )}
      {uploadStatus === "uploading" && (
        <div className="space-y-2">
          <p className="text-sm">Uploading {field.value?.name}</p>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
      {uploadStatus === "success" && (
        <div className="text-green-600">
          <CheckCircle className="mx-auto h-10 w-10" />
          <p>Video listo</p>
        </div>
      )}
      {uploadStatus === "error" && (
        <div className="text-red-600">
          <AlertCircle className="mx-auto h-10 w-10" />
          <p>Upload failed. Please try again.</p>
        </div>
      )}
    </div>
  );
}
