import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ImageDropzoneProps {
  field: {
    value: File | null | undefined;
    onChange: (file: File | null) => void;
    onBlur: () => void;
    name: string;
  };
}

export function ImageDropzone({ field }: ImageDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0];
      if (imageFile) {
        field.onChange(imageFile); // Update form value
        setPreviewUrl(URL.createObjectURL(imageFile)); // Generate preview URL
        simulateUpload(imageFile);
      }
    },
    [field],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const simulateUpload = (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);
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

  const removeImage = () => {
    field.onChange(null); // Reset form value
    setPreviewUrl(null); // Clear preview URL
    setUploadProgress(0); // Reset progress
    setUploadStatus("idle"); // Reset status
  };

  return (
    <div className="w-full">
      {previewUrl && uploadStatus === "success" ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className=" h-[300px] rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1 shadow"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} name={field.name} onBlur={field.onBlur} />
          {uploadStatus === "idle" && (
            <>
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Arrastra y suelta una imagen o haz clic para seleccionar una
                imagen
              </p>
              <p className="mt-1 text-xs text-gray-500">
                formatos soportados: JPG, JPEG, PNG, GIF
              </p>
            </>
          )}
          {uploadStatus === "uploading" && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Uploading {field.value?.name}
              </p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="text-red-600 space-y-2">
              <AlertCircle className="mx-auto h-12 w-12" />
              <p className="text-sm font-medium">
                Hubo un error al subir el archivo. Por favor, inténtalo de
                nuevo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
