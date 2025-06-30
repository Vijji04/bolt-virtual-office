import { GameObj, Vec2 } from 'kaplay';

export interface PlayerConfig {
  pos: Vec2;
  speed: number;
}

export function createPlayer(k: any, config: PlayerConfig): GameObj {
  console.log('👤 Creating player at position:', config.pos, 'speed:', config.speed);
  
  // Create a more detailed player character
  const player = k.add([
    k.rect(16, 16),
    k.color(0, 150, 255), // Blue body
    k.pos(config.pos),
    k.area(),
    k.body(),
    k.outline(2, k.rgb(0, 100, 200)),
    'player',
    {
      speed: config.speed,
      direction: k.vec2(0, 0),
      isMoving: false,
    }
  ]);

  console.log('✅ Player created successfully');

  // Add player details (head)
  k.add([
    k.rect(12, 8),
    k.color(255, 220, 177), // Skin color
    k.pos(config.pos.x + 2, config.pos.y - 6),
    k.outline(1, k.rgb(200, 180, 140)),
    k.z(1),
    {
      follow: player,
      offsetX: 2,
      offsetY: -6,
    }
  ]);

  // Add eyes
  k.add([
    k.rect(2, 2),
    k.color(0, 0, 0),
    k.pos(config.pos.x + 4, config.pos.y - 4),
    k.z(2),
    {
      follow: player,
      offsetX: 4,
      offsetY: -4,
    }
  ]);

  k.add([
    k.rect(2, 2),
    k.color(0, 0, 0),
    k.pos(config.pos.x + 8, config.pos.y - 4),
    k.z(2),
    {
      follow: player,
      offsetX: 8,
      offsetY: -4,
    }
  ]);

  // Update follower positions
  k.onUpdate(() => {
    k.get('*').forEach((obj: any) => {
      if (obj.follow === player) {
        obj.pos.x = player.pos.x + obj.offsetX;
        obj.pos.y = player.pos.y + obj.offsetY;
      }
    });
  });

  return player;
}

export function setupPlayerMovement(k: any, player: GameObj, gameWidth: number, gameHeight: number) {
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  // Arrow key handlers
  k.onKeyDown('left', () => { keys.left = true; });
  k.onKeyDown('right', () => { keys.right = true; });
  k.onKeyDown('up', () => { keys.up = true; });
  k.onKeyDown('down', () => { keys.down = true; });

  k.onKeyRelease('left', () => { keys.left = false; });
  k.onKeyRelease('right', () => { keys.right = false; });
  k.onKeyRelease('up', () => { keys.up = false; });
  k.onKeyRelease('down', () => { keys.down = false; });

  // WASD key handlers
  k.onKeyDown('a', () => { keys.left = true; });
  k.onKeyDown('d', () => { keys.right = true; });
  k.onKeyDown('w', () => { keys.up = true; });
  k.onKeyDown('s', () => { keys.down = true; });

  k.onKeyRelease('a', () => { keys.left = false; });
  k.onKeyRelease('d', () => { keys.right = false; });
  k.onKeyRelease('w', () => { keys.up = false; });
  k.onKeyRelease('s', () => { keys.down = false; });

  // Movement update
  k.onUpdate(() => {
    const direction = k.vec2(0, 0);
    
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;
    if (keys.up) direction.y -= 1;
    if (keys.down) direction.y += 1;
    
    // Check if direction has magnitude using dot product
    const magnitude = direction.x * direction.x + direction.y * direction.y;
    
    if (magnitude > 0) {
      // Normalize the direction vector manually
      const length = Math.sqrt(magnitude);
      direction.x /= length;
      direction.y /= length;
      
      player.move(direction.scale(player.speed));
      player.isMoving = true;
    } else {
      player.isMoving = false;
    }

    // Clamp player position to stay within game boundaries
    const playerWidth = player.width;
    const playerHeight = player.height;
    
    player.pos.x = k.clamp(player.pos.x, 0, gameWidth - playerWidth);
    player.pos.y = k.clamp(player.pos.y, 0, gameHeight - playerHeight);
  });
}