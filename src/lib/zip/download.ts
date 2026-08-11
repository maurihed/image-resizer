import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { QueueItem } from "@/types/image";

export function downloadBlob(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

export async function zipQueueItems(
  items: QueueItem[],
  zipName = "resized-photos.zip",
): Promise<void> {
  if (items.length === 0) {
    throw new Error("No photos to download");
  }

  if (items.length === 1) {
    downloadBlob(items[0].blob, items[0].name);
    return;
  }

  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  for (const item of items) {
    let name = item.name;
    const count = usedNames.get(name) ?? 0;
    if (count > 0) {
      const dot = name.lastIndexOf(".");
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : "";
      name = `${stem}_${count}${ext}`;
    }
    usedNames.set(item.name, count + 1);
    zip.file(name, item.blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, zipName);
}
