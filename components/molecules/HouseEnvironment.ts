import { GameObj, Vec2 } from 'kaplay';
import { AssetLoader } from './AssetLoader';

export interface Furniture {
  type: 'bed' | 'table' | 'chair' | 'plant' | 'bookshelf' | 'window' | 'door';
  pos: Vec2;
  size: Vec2;
  color: [number, number, number];
}

export async function createHouseEnvironment(k: any, width: number, height: number) {
  const { add, pos, rect, color, width: kWidth, height: kHeight, vec2, area, body, anchor, z, outline } = k;
  const wallThickness = 10;
  
  const assetLoader = new AssetLoader(k);
  await assetLoader.loadAllAssets();

  // Create tiled floor covering the entire screen
  assetLoader.createTiledFloor(width, height, 32);

  // Responsive wall thickness based on game size
  const wallColor = [101, 67, 33];
  
  // Bottom wall
  add([
    rect(width, wallThickness),
    color(...wallColor),
    pos(0, kHeight - wallThickness),
    area(),
    body({ isStatic: true }),
    'wall',
  ]);
  
  // Left wall
  add([
    rect(wallThickness, kHeight),
    color(...wallColor),
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    'wall',
  ]);
  
  // Right wall
  add([
    rect(wallThickness, kHeight),
    color(...wallColor),
    pos(kWidth - wallThickness, 0),
    area(),
    body({ isStatic: true }),
    'wall',
  ]);

  // Scale furniture sizes based on game dimensions
  const furnitureScale = Math.min(width, height) / 300;
  
  // Add a kitchen area in the top-left corner
  const kitchenPos = vec2(wallThickness + 20, wallThickness + 20);
  assetLoader.createFurnitureObject('kitchen_area', kitchenPos, furnitureScale);

  // --- Desk Area ---
  const deskAsset = assetLoader.getAssetById('modern_desk');
  const deskWidth = (deskAsset?.width || 80) * furnitureScale;

  // Desk 1 (right)
  const desk1Pos = vec2(width - (deskWidth + 40), height - (80 * furnitureScale));
  assetLoader.createFurnitureObject('modern_desk', desk1Pos, furnitureScale, 'desk_1');

  // Monitor 1 on Desk 1
  const monitor1Pos = vec2(
    desk1Pos.x + (20 * furnitureScale),
    desk1Pos.y - (8 * furnitureScale)
  );
  assetLoader.createFurnitureObject('computer_monitor', monitor1Pos, furnitureScale, 'monitor_1');
  
  // Desk 2 (left)
  const desk2Pos = vec2(desk1Pos.x - deskWidth - 20, desk1Pos.y);
  assetLoader.createFurnitureObject('modern_desk', desk2Pos, furnitureScale, 'desk_2');

  // Monitor 2 on Desk 2
  const monitor2Pos = vec2(
    desk2Pos.x + (20 * furnitureScale),
    desk2Pos.y - (8 * furnitureScale)
  );
  assetLoader.createFurnitureObject('computer_monitor', monitor2Pos, furnitureScale, 'monitor_2');

  // Original furniture using AssetLoader (remove old desk)
  const chairPos = vec2(width - (90 * furnitureScale), height - (60 * furnitureScale));
  assetLoader.createFurnitureObject('office_chair', chairPos, furnitureScale);

  const plantPos = vec2(width - (50 * furnitureScale), wallThickness + 20);
  assetLoader.createFurnitureObject('plant_pot', plantPos, furnitureScale);

  const bookshelfPos = vec2(wallThickness + 10, height - (100 * furnitureScale));
  assetLoader.createFurnitureObject('bookshelf', bookshelfPos, furnitureScale);

  // Add a decorative rug using the AssetLoader, centered on the screen
  const rugAsset = assetLoader.getAssetById('decorative_rug');
  if (rugAsset) {
    const rugWidth = rugAsset.width * furnitureScale;
    const rugHeight = rugAsset.height * furnitureScale;
    const rugPos = vec2(width / 2 - rugWidth / 2, height / 2 - rugHeight / 2);
    assetLoader.createFurnitureObject('decorative_rug', rugPos, furnitureScale);
  }
}