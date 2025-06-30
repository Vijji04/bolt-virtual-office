// import { GameObj, Vec2 } from 'kaplay';
// import { OfficeObjects } from './OfficeObjects';

// export function createOfficeEnvironment(k: any, width: number, height: number) {
//   // White grid floor (same as house)
//   const gridSize = 16;
  
//   // Base white floor
//   k.add([
//     k.rect(width, height),
//     k.color(255, 255, 255), // White floor
//     k.pos(0, 0),
//     k.z(-2),
//   ]);

//   // Create grid pattern
//   for (let x = 0; x <= width; x += gridSize) {
//     k.add([
//       k.rect(1, height),
//       k.color(220, 220, 220), // Light gray grid lines
//       k.pos(x, 0),
//       k.z(-1),
//     ]);
//   }
  
//   for (let y = 0; y <= height; y += gridSize) {
//     k.add([
//       k.rect(width, 1),
//       k.color(220, 220, 220), // Light gray grid lines
//       k.pos(0, y),
//       k.z(-1),
//     ]);
//   }

//   // Office walls (lighter color than house)
//   const wallThickness = Math.max(8, Math.min(16, width / 50));
//   const wallColor = [180, 180, 180]; // Light gray office walls
  
//   // Top wall
//   k.add([
//     k.rect(width, wallThickness),
//     k.color(...wallColor),
//     k.pos(0, 0),
//     k.area(),
//     k.body({ isStatic: true }),
//     'wall',
//   ]);
  
//   // Bottom wall
//   k.add([
//     k.rect(width, wallThickness),
//     k.color(...wallColor),
//     k.pos(0, height - wallThickness),
//     k.area(),
//     k.body({ isStatic: true }),
//     'wall',
//   ]);
  
//   // Left wall
//   k.add([
//     k.rect(wallThickness, height),
//     k.color(...wallColor),
//     k.pos(0, 0),
//     k.area(),
//     k.body({ isStatic: true }),
//     'wall',
//   ]);
  
//   // Right wall
//   k.add([
//     k.rect(wallThickness, height),
//     k.color(...wallColor),
//     k.pos(width - wallThickness, 0),
//     k.area(),
//     k.body({ isStatic: true }),
//     'wall',
//   ]);

//   return { wallThickness, gridSize };
// }

// export async function populateOfficeWithObjects(k: any, width: number, height: number, wallThickness: number) {
//   const officeObjects = new OfficeObjects(k);
  
//   // Load office sprites first
//   await officeObjects.loadOfficeSprites();
  
//   const furnitureScale = Math.min(width, height) / 400;
  
//   // Create multiple workstations
//   const workstations = [
//     // Top-left workstation
//     k.vec2(wallThickness + 40, wallThickness + 40),
//     // Top-right workstation
//     k.vec2(width - wallThickness - 120, wallThickness + 40),
//     // Bottom-left workstation
//     k.vec2(wallThickness + 40, height - wallThickness - 100),
//     // Bottom-right workstation
//     k.vec2(width - wallThickness - 120, height - wallThickness - 100),
//   ];

//   // Create workstations
//   workstations.forEach(pos => {
//     officeObjects.createOfficeWorkstation(pos, furnitureScale);
//   });

//   // Add a central meeting area
//   const centerX = width / 2;
//   const centerY = height / 2;
  
//   // Conference table
//   officeObjects.createOfficeObject({
//     type: 'desk',
//     pos: k.vec2(centerX - 40, centerY - 16),
//     scale: furnitureScale * 1.5,
//     size: k.vec2(80, 32),
//     fallbackColor: [101, 67, 33], // Dark wood conference table
//   });

//   // Chairs around conference table
//   const chairPositions = [
//     k.vec2(centerX - 60, centerY),
//     k.vec2(centerX + 60, centerY),
//     k.vec2(centerX - 20, centerY - 40),
//     k.vec2(centerX + 20, centerY - 40),
//     k.vec2(centerX - 20, centerY + 40),
//     k.vec2(centerX + 20, centerY + 40),
//   ];

//   chairPositions.forEach(pos => {
//     officeObjects.createOfficeObject({
//       type: 'chair',
//       pos: pos,
//       scale: furnitureScale,
//       size: k.vec2(20, 20),
//       fallbackColor: [64, 64, 64],
//     });
//   });

//   // Add whiteboard on wall
//   officeObjects.createOfficeObject({
//     type: 'whiteboard',
//     pos: k.vec2(wallThickness + 10, wallThickness + 20),
//     scale: furnitureScale,
//     size: k.vec2(64, 32),
//     fallbackColor: [255, 255, 255], // White board
//   });

//   // Add printer station
//   officeObjects.createOfficeObject({
//     type: 'printer',
//     pos: k.vec2(width - wallThickness - 50, height / 2),
//     scale: furnitureScale,
//     size: k.vec2(32, 24),
//     fallbackColor: [200, 200, 200], // Light gray printer
//   });
// }