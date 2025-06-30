"use client";

import { useEffect, useCallback, useState } from "react";
import GameCanvas from "../atoms/GameCanvas";
import { createGameScene } from "../organisms/GameScene";

export default function GameLayout() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameSize, setGameSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate responsive game size
  const calculateGameSize = useCallback(() => {
    if (typeof window === "undefined") return { width: 400, height: 300 };

    const padding = 16; // Reduced padding
    const headerSpace = 60; // Reduced header space

    const maxWidth = Math.min(window.innerWidth - padding, 1600); // Increased max width
    const maxHeight = Math.min(window.innerHeight - headerSpace, 900); // Increased max height

    // Maintain 4:3 aspect ratio for retro feel
    const aspectRatio = 4 / 3;
    let gameWidth = maxWidth;
    let gameHeight = gameWidth / aspectRatio;

    // If height exceeds available space, constrain by height
    if (gameHeight > maxHeight) {
      gameHeight = maxHeight;
      gameWidth = gameHeight * aspectRatio;
    }

    // Ensure minimum playable size
    gameWidth = Math.max(gameWidth, 320);
    gameHeight = Math.max(gameHeight, 240);

    // Round to even numbers for crisp pixel rendering
    return {
      width: Math.floor(gameWidth / 2) * 2,
      height: Math.floor(gameHeight / 2) * 2,
    };
  }, []);

  // Update game size on window resize (only after client-side hydration)
  useEffect(() => {
    if (!isClient) return;

    const updateSize = () => {
      const newSize = calculateGameSize();
      setGameSize(newSize);
    };

    // Set initial size
    updateSize();

    // Add resize listener
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [calculateGameSize, isClient]);

  const initializeGame = useCallback(
    async (canvas: HTMLCanvasElement) => {
      // Don't initialize if size is not determined yet
      if (!gameSize) return;

      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import of kaplay to ensure it loads in browser environment
        const { default: kaplay } = await import("kaplay");

        const k = kaplay({
          canvas,
          width: gameSize.width,
          height: gameSize.height,
          pixelDensity: 1,
          crisp: true,
          background: [245, 245, 245], // Light gray background to complement white floor
        });

        await createGameScene(k, gameSize.width, gameSize.height);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing game:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsLoading(false);
      }
    },
    [gameSize]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-amber-100 p-4">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Game Error</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Reload Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-amber-100 p-4">
      {/* Top-right floating image with hyperlink */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Go to Bolt New"
        className="fixed top-4 right-4 z-50"
        tabIndex={0}
      >
        <img
          src="/assets/black_circle_360x360.png"
          alt="Black Circle"
          className="w-24 h-24 pointer-events-auto select-none hover:scale-105 transition-transform"
          style={{ objectFit: "contain" }}
        />
      </a>
      {/* Game Container */}
      <div className="relative">
        {/* Loading Overlay - only show after client hydration and size is set */}
        {isClient && isLoading && gameSize && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white rounded-lg border-4 border-gray-600 z-10"
            style={{ width: gameSize.width, height: gameSize.height }}
          >
            <div className="text-gray-800 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-2"></div>
              <p className="font-mono text-sm">Loading Game...</p>
            </div>
          </div>
        )}

        {/* Game Canvas Container */}
        <div className="bg-black p-2 sm:p-4 rounded-lg shadow-2xl border-4 border-gray-600">
          <div className="relative">
            {/* Render GameCanvas only after client-side hydration and size calculation */}
            {isClient && gameSize ? (
              <GameCanvas
                onGameInit={initializeGame}
                className="border-2 border-gray-400 bg-white rounded"
                style={{
                  width: gameSize.width,
                  height: gameSize.height,
                  maxWidth: "100%",
                }}
              />
            ) : (
              // Static placeholder for server-side rendering and initial hydration
              <div
                className="border-2 border-gray-400 bg-white rounded flex items-center justify-center"
                style={{
                  width: 400,
                  height: 300,
                }}
              >
                <div className="text-gray-800 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-2"></div>
                  <p className="font-mono text-sm">Initializing...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
