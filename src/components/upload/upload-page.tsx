"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Panel } from "@/components/ui/panel";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/context/toast-context";
import { saveSource } from "@/lib/db/sources";
import { fileToSourceImage, ImageValidationError } from "@/lib/image/load";

export function UploadPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isWorking, setIsWorking] = useState(false);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setIsWorking(true);
    try {
      const source = await fileToSourceImage(file);
      await saveSource(source);
      pushToast("Photo loaded", "success");
      router.push(`/editor/${source.id}`);
    } catch (error) {
      const message =
        error instanceof ImageValidationError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Could not open that file";
      pushToast(message, "error");
      setIsWorking(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Upload a photo</h1>
        <p className="text-sm text-muted">
          Work stays on your device. Originals and exports are stored in
          IndexedDB in this browser.
        </p>
      </div>
      <Panel>
        {isWorking ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-muted">Preparing editor…</p>
          </div>
        ) : (
          <FileDropzone onFiles={handleFiles} />
        )}
      </Panel>
    </div>
  );
}
