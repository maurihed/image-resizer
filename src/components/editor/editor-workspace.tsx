"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spinner } from "@/components/ui/spinner";
import { DimensionFields } from "@/components/editor/dimension-fields";
import { PresetPicker } from "@/components/editor/preset-picker";
import { ZoomControls } from "@/components/editor/zoom-controls";
import {
  DEFAULT_PRESET_ID,
  getPresetById,
  swapOrientation,
} from "@/config/presets";
import { useQueue } from "@/context/queue-context";
import { useToast } from "@/context/toast-context";
import { useImageElement } from "@/hooks/use-image-element";
import { exportFrameToBlob } from "@/lib/image/export";
import { buildExportFilename } from "@/lib/image/format";
import { autoFit, scaleAboutPoint } from "@/lib/image/geometry";
import { createId } from "@/lib/utils/id";
import type {
  EditorMode,
  ImageTransform,
  Point,
  SourceImage,
} from "@/types/image";

const ResizerStage = dynamic(() => import("@/components/editor/resizer-stage"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-border bg-panel">
      <Spinner />
    </div>
  ),
});

interface EditorWorkspaceProps {
  source: SourceImage;
}

export function EditorWorkspace({ source }: EditorWorkspaceProps) {
  const router = useRouter();
  const { addItem } = useQueue();
  const { pushToast } = useToast();
  const { image, isLoading, error } = useImageElement(source.blob);

  const defaultPreset = getPresetById(DEFAULT_PRESET_ID)!;
  const [mode, setMode] = useState<EditorMode>("default");
  const [presetId, setPresetId] = useState<string | null>(defaultPreset.id);
  const [frame, setFrame] = useState({
    width: defaultPreset.width,
    height: defaultPreset.height,
  });
  const [allowUpscale, setAllowUpscale] = useState(true);
  const [transform, setTransform] = useState<ImageTransform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [cropOffset, setCropOffset] = useState<Point>({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const imageSize = useMemo(
    () => ({ width: source.width, height: source.height }),
    [source.height, source.width],
  );

  const applyAutoFit = useCallback(
    (nextFrame: { width: number; height: number }, upscale: boolean) => {
      const { transform: fitted } = autoFit(imageSize, nextFrame, {
        allowUpscale: upscale,
      });
      setTransform(fitted);
    },
    [imageSize],
  );

  useEffect(() => {
    applyAutoFit(frame, allowUpscale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.id]);

  const handleFrameChange = useCallback(
    (next: { width: number; height: number }) => {
      setFrame(next);
      setPresetId(null);
      if (mode === "default") {
        applyAutoFit(next, allowUpscale);
      }
    },
    [mode, applyAutoFit, allowUpscale],
  );

  const handlePreset = (preset: { id: string; width: number; height: number }) => {
    setPresetId(preset.id);
    setFrame({ width: preset.width, height: preset.height });
    setCropOffset({ x: 0, y: 0 });
    applyAutoFit(
      { width: preset.width, height: preset.height },
      allowUpscale,
    );
  };

  const handleModeChange = (next: EditorMode) => {
    setMode(next);
    setCropOffset({ x: 0, y: 0 });
    if (next === "default") {
      applyAutoFit(frame, allowUpscale);
    }
  };

  const zoomBy = (factor: number) => {
    const center = { x: frame.width / 2, y: frame.height / 2 };
    const nextScale = Math.min(Math.max(transform.scale * factor, 0.05), 20);
    setTransform(scaleAboutPoint(transform, imageSize, nextScale, center));
  };

  const handleAddToQueue = async () => {
    if (!image) return;
    setIsExporting(true);
    try {
      const { blob, mime, extension } = await exportFrameToBlob({
        image,
        imageSize,
        frame,
        transform,
        cropOffset,
        sourceMime: source.mime,
        background: null,
      });
      const name = buildExportFilename(
        source.name,
        frame.width,
        frame.height,
        extension,
      );
      await addItem({
        id: createId("queue"),
        sourceId: source.id,
        name,
        width: frame.width,
        height: frame.height,
        mime: mime as SourceImage["mime"],
        blob,
        createdAt: Date.now(),
      });
      pushToast(`Added ${name} to queue`, "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      pushToast(message, "error");
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-xl border border-danger/40 bg-danger-muted p-6 text-sm text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-h-[420px] flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold">{source.name}</h1>
            <Badge>
              {source.width}×{source.height}
            </Badge>
            <Badge>
              {frame.width}×{frame.height} export
            </Badge>
          </div>
          <ZoomControls
            scale={transform.scale}
            onZoomIn={() => zoomBy(1.1)}
            onZoomOut={() => zoomBy(1 / 1.1)}
            onReset={() => applyAutoFit(frame, allowUpscale)}
          />
        </div>
        <div className="relative min-h-0 flex-1">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-panel">
              <Spinner />
            </div>
          ) : (
            <ResizerStage
              image={image}
              imageSize={imageSize}
              frame={frame}
              transform={transform}
              mode={mode}
              cropOffset={cropOffset}
              onTransformChange={setTransform}
              onFrameChange={handleFrameChange}
              onCropOffsetChange={setCropOffset}
            />
          )}
        </div>
        <p className="text-xs text-muted">
          Drag the photo to reposition. Scroll to zoom. Transparent areas stay
          transparent on PNG/WebP export.
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        <Panel title="Mode">
          <SegmentedControl
            ariaLabel="Editor mode"
            value={mode}
            onChange={handleModeChange}
            options={[
              { value: "default", label: "Default" },
              { value: "custom", label: "Custom" },
            ]}
          />
          <p className="mt-3 text-xs text-muted">
            {mode === "default"
              ? "Pick a preset. We fit the photo (cover when large, centered with transparent pad when small)."
              : "Set exact pixels or resize the amber crop frame. Move and zoom the photo freely."}
          </p>
        </Panel>

        <Panel title="Dimensions">
          <DimensionFields
            width={frame.width}
            height={frame.height}
            onChange={handleFrameChange}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const swapped = swapOrientation(frame.width, frame.height);
                handleFrameChange(swapped);
              }}
            >
              Swap orientation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAllowUpscale((v) => {
                  const next = !v;
                  applyAutoFit(frame, next);
                  return next;
                });
              }}
            >
              Upscale: {allowUpscale ? "On" : "Off"}
            </Button>
          </div>
        </Panel>

        {mode === "default" ? (
          <Panel title="Album presets">
            <div className="max-h-72 overflow-y-auto pr-1">
              <PresetPicker value={presetId} onChange={handlePreset} />
            </div>
          </Panel>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            disabled={!image || isExporting}
            onClick={handleAddToQueue}
          >
            {isExporting ? "Exporting…" : "Add to queue"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/queue")}
          >
            Go to queue
          </Button>
          <Button variant="ghost" onClick={() => router.push("/upload")}>
            Upload another
          </Button>
        </div>
      </aside>
    </div>
  );
}
