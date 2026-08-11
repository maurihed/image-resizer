"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import type Konva from "konva";
import { useStageSize } from "@/hooks/use-stage-size";
import { stageScaleToFit } from "@/lib/image/geometry";
import type { EditorMode, ImageTransform, Point, Size } from "@/types/image";

const GLOW_STROKE = "#66f0ff";
const GLOW_COLOR = "rgba(102, 240, 255, 0.55)";
const FRAME_FILL = "rgba(11, 13, 16, 0.82)";

interface ResizerStageProps {
  image: HTMLImageElement | null;
  imageSize: Size;
  frame: Size;
  transform: ImageTransform;
  mode: EditorMode;
  cropOffset: Point;
  onTransformChange: (transform: ImageTransform) => void;
  onFrameChange?: (frame: Size) => void;
  onCropOffsetChange?: (offset: Point) => void;
}

const ResizerStage = memo(function ResizerStage({
  image,
  imageSize,
  frame,
  transform,
  mode,
  cropOffset,
  onTransformChange,
  onFrameChange,
  onCropOffsetChange,
}: ResizerStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const cropRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const viewport = useStageSize(containerRef);

  const viewScale = useMemo(
    () => stageScaleToFit(frame, viewport, 40),
    [frame, viewport],
  );

  const stageWidth = Math.max(viewport.width, 1);
  const stageHeight = Math.max(viewport.height, 1);
  const offsetX = (stageWidth - frame.width * viewScale) / 2;
  const offsetY = (stageHeight - frame.height * viewScale) / 2;

  const glowShadowProps = useMemo(
    () => ({
      shadowColor: GLOW_COLOR,
      shadowBlur: 6 / viewScale,
      shadowOpacity: 1,
      shadowEnabled: true,
    }),
    [viewScale],
  );

  useEffect(() => {
    if (mode !== "custom") return;
    const transformer = transformerRef.current;
    const crop = cropRef.current;
    if (!transformer || !crop) return;
    transformer.nodes([crop]);
    transformer.getLayer()?.batchDraw();
  }, [mode, frame.width, frame.height]);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!image) return;
      const direction = event.deltaY > 0 ? -1 : 1;
      const factor = direction > 0 ? 1.08 : 1 / 1.08;
      const nextScale = Math.min(Math.max(transform.scale * factor, 0.05), 20);

      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const pointerX = (event.clientX - bounds.left - offsetX) / viewScale;
      const pointerY = (event.clientY - bounds.top - offsetY) / viewScale;

      const prevW = imageSize.width * transform.scale;
      const prevH = imageSize.height * transform.scale;
      const nextW = imageSize.width * nextScale;
      const nextH = imageSize.height * nextScale;
      const relX = prevW === 0 ? 0.5 : (pointerX - transform.x) / prevW;
      const relY = prevH === 0 ? 0.5 : (pointerY - transform.y) / prevH;

      onTransformChange({
        scale: nextScale,
        x: pointerX - relX * nextW,
        y: pointerY - relY * nextH,
      });
    },
    [
      image,
      imageSize.height,
      imageSize.width,
      offsetX,
      offsetY,
      onTransformChange,
      transform,
      viewScale,
    ],
  );

  const isCustom = mode === "custom";

  return (
    <div
      ref={containerRef}
      className="checkerboard absolute inset-0 overflow-hidden rounded-xl border border-border"
      onWheel={handleWheel}
    >
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          <Group x={offsetX} y={offsetY} scaleX={viewScale} scaleY={viewScale}>
            {/* dark semi-transparent backdrop for the frame area */}
            <Rect
              x={0}
              y={0}
              width={frame.width}
              height={frame.height}
              fill={FRAME_FILL}
              listening={false}
            />
            {image ? (
              <KonvaImage
                ref={imageRef}
                image={image}
                x={transform.x}
                y={transform.y}
                width={imageSize.width * transform.scale}
                height={imageSize.height * transform.scale}
                draggable
                onDragEnd={(e) => {
                  onTransformChange({
                    ...transform,
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              />
            ) : null}
            {/* outer frame border with glow — follows crop offset in custom mode */}
            <Rect
              x={isCustom ? cropOffset.x : 0}
              y={isCustom ? cropOffset.y : 0}
              width={frame.width}
              height={frame.height}
              fill="transparent"
              stroke={GLOW_STROKE}
              strokeWidth={2.5 / viewScale}
              listening={false}
              {...glowShadowProps}
            />
            {isCustom ? (
              <>
                {/* dim reference outline for the full frame area */}
                <Rect
                  x={0}
                  y={0}
                  width={frame.width}
                  height={frame.height}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1 / viewScale}
                  listening={false}
                />
                {/* grid lines — offset by crop position */}
                <Line
                  points={[
                    cropOffset.x + frame.width / 3,
                    cropOffset.y,
                    cropOffset.x + frame.width / 3,
                    cropOffset.y + frame.height,
                  ]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1 / viewScale}
                  listening={false}
                />
                <Line
                  points={[
                    cropOffset.x + (frame.width * 2) / 3,
                    cropOffset.y,
                    cropOffset.x + (frame.width * 2) / 3,
                    cropOffset.y + frame.height,
                  ]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1 / viewScale}
                  listening={false}
                />
                <Line
                  points={[
                    cropOffset.x,
                    cropOffset.y + frame.height / 3,
                    cropOffset.x + frame.width,
                    cropOffset.y + frame.height / 3,
                  ]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1 / viewScale}
                  listening={false}
                />
                <Line
                  points={[
                    cropOffset.x,
                    cropOffset.y + (frame.height * 2) / 3,
                    cropOffset.x + frame.width,
                    cropOffset.y + (frame.height * 2) / 3,
                  ]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1 / viewScale}
                  listening={false}
                />
                {/* draggable crop rect */}
                <Rect
                  ref={cropRef}
                  x={cropOffset.x}
                  y={cropOffset.y}
                  width={frame.width}
                  height={frame.height}
                  stroke="#fbbf24"
                  dash={[8 / viewScale, 6 / viewScale]}
                  strokeWidth={2.5 / viewScale}
                  shadowColor="rgba(251, 191, 36, 0.5)"
                  shadowBlur={5 / viewScale}
                  shadowOpacity={1}
                  shadowEnabled
                  draggable
                  onDragEnd={() => {
                    const node = cropRef.current;
                    if (!node || !onCropOffsetChange) return;
                    onCropOffsetChange({
                      x: node.x(),
                      y: node.y(),
                    });
                  }}
                  onTransformEnd={() => {
                    const node = cropRef.current;
                    if (!node || !onFrameChange) return;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    const nextWidth = Math.max(
                      1,
                      Math.round(Math.abs(node.width() * scaleX)),
                    );
                    const nextHeight = Math.max(
                      1,
                      Math.round(Math.abs(node.height() * scaleY)),
                    );
                    node.width(nextWidth);
                    node.height(nextHeight);
                    node.x(cropOffset.x);
                    node.y(cropOffset.y);
                    onFrameChange({ width: nextWidth, height: nextHeight });
                  }}
                />
                <Transformer
                  ref={transformerRef}
                  rotateEnabled={false}
                  flipEnabled={false}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                />
              </>
            ) : null}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
});

export default ResizerStage;
