import { createPlayer, setupPlayerMovement } from '../molecules/Player';
import { createHouseEnvironment } from '../molecules/HouseEnvironment';

export async function createGameScene(k: any, gameWidth?: number, gameHeight?: number) {
  // Use provided dimensions or fallback to defaults
  const GAME_WIDTH = gameWidth || 400;
  const GAME_HEIGHT = gameHeight || 300;

  console.log('🎮 Creating game scene with dimensions:', GAME_WIDTH, 'x', GAME_HEIGHT);

  // Create the house environment with responsive dimensions
  await createHouseEnvironment(k, GAME_WIDTH, GAME_HEIGHT);

  // Create the player in the center
  const player = createPlayer(k, {
    pos: k.vec2(GAME_WIDTH / 2, GAME_HEIGHT / 2),
    speed: Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.25, // Scale speed with game size
  });

  console.log('🎮 Player created at:', player.pos);

  // Setup player movement
  setupPlayerMovement(k, player, GAME_WIDTH, GAME_HEIGHT);

  // Camera follows player with bounds
  k.onUpdate(() => {
    const camX = Math.max(
      k.width() / 2,
      Math.min(player.pos.x, GAME_WIDTH - k.width() / 2)
    );
    const camY = Math.max(
      k.height() / 2,
      Math.min(player.pos.y, GAME_HEIGHT - k.height() / 2)
    );
    
    k.camPos(camX, camY);
  });

  return { player, GAME_WIDTH, GAME_HEIGHT };
}