"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { getSource } from "@/lib/db/sources";
import type { SourceImage } from "@/types/image";
import { useEffect, useState } from "react";
import { EditorWorkspace } from "@/components/editor/editor-workspace";

export function EditorPage({ sourceId }: { sourceId: string }) {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      try {
        const found = await getSource(sourceId);
        if (!active) return;
        if (!found) {
          setMissing(true);
          setSource(null);
        } else {
          setMissing(false);
          setSource(found);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [sourceId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (missing || !source) {
    return (
      <EmptyState
        title="Photo not found"
        description="This image is no longer in browser storage. Upload it again."
        action={<Button href="/upload">Go to upload</Button>}
      />
    );
  }

  return <EditorWorkspace source={source} />;
}
