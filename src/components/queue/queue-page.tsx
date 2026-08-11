"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { Spinner } from "@/components/ui/spinner";
import { useQueue } from "@/context/queue-context";
import { useToast } from "@/context/toast-context";
import { useObjectUrl } from "@/hooks/use-object-url";
import { zipQueueItems } from "@/lib/zip/download";
import type { QueueItem } from "@/types/image";

function QueueCard({
  item,
  onRemove,
}: {
  item: QueueItem;
  onRemove: (id: string) => void;
}) {
  const url = useObjectUrl(item.blob);
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-panel-elevated p-3">
      <div className="checkerboard h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <p className="truncate text-sm font-medium">{item.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge>
              {item.width}×{item.height}
            </Badge>
            <Badge>{item.mime.replace("image/", "").toUpperCase()}</Badge>
          </div>
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}

export function QueuePage() {
  const { items, isLoading, removeItem, clear } = useQueue();
  const { pushToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await zipQueueItems(items);
      pushToast(
        items.length === 1 ? "Download started" : "ZIP download started",
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Download failed";
      pushToast(message, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Download queue
          </h1>
          <p className="text-sm text-muted">
            Exported photos ready to download. Quality matches the source
            format.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={items.length === 0}
            onClick={async () => {
              await clear();
              pushToast("Queue cleared", "info");
            }}
          >
            Clear all
          </Button>
          <Button
            disabled={items.length === 0 || isDownloading}
            onClick={handleDownload}
          >
            {isDownloading
              ? "Preparing…"
              : items.length <= 1
                ? "Download"
                : `Download ZIP (${items.length})`}
          </Button>
        </div>
      </div>

      <Panel>
        {items.length === 0 ? (
          <EmptyState
            title="Queue is empty"
            description="Resize a photo in the editor and add it here."
            action={<Button href="/upload">Upload a photo</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <QueueCard
                key={item.id}
                item={item}
                onRemove={async (id) => {
                  await removeItem(id);
                  pushToast("Removed from queue", "info");
                }}
              />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
