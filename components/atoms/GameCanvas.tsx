"use client";

import { useEffect, useRef } from "react";

interface GameCanvasProps {
  onGameInit: (canvas: HTMLCanvasElement) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function GameCanvas({
  onGameInit,
  className,
  style,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      onGameInit(canvasRef.current);
    }
  }, [onGameInit]);

  return (
    <canvas
      ref={canvasRef}
      className={`pixelated ${className}`}
      style={{
        imageRendering: "pixelated",
        // imageRendering: '-moz-crisp-edges',
        // imageRendering: 'crisp-edges',
        ...style,
      }}
    />
  );
}
