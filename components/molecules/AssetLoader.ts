import { GameObj, Vec2 } from 'kaplay';

// Custom furniture assets configuration
export interface FurnitureAsset {
  id: string;
  name: string;
  width: number;
  height: number;
  // Support multiple asset sources
  imageUrl?: string;        // External URL
  base64?: string;         // Base64 data URL
  publicPath?: string;     // Path in public folder
  fallbackColor?: [number, number, number];  // RGB fallback color
}

export const CUSTOM_FURNITURE_ASSETS: FurnitureAsset[] = [
  // Floor asset (for covering entire screen)
  {
    id: 'floor_tiles',
    name: 'Floor Tiles',
    width: 32,
    height: 32,
    imageUrl: 'https://i.ibb.co/jkyz88XC/Floor.png',
    fallbackColor: [245, 245, 245] // Light gray
  },
  // Door and Window assets using external URLs
  {
    id: 'door',
    name: 'Door',
    width: 26,
    height: 46,
    imageUrl: "https://i.ibb.co/LzPRpH85/Door.png",
    fallbackColor: [139, 69, 19] // Brown
  },
  {
    id: 'window',
    name: 'Window',
    width: 25,
    height: 28,
    imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=25&h=28&fit=crop',
    fallbackColor: [135, 206, 235] // Sky blue
  },
  // Office furniture
  {
    id: 'modern_desk',
    name: 'Modern Desk',
    width: 80,
    height: 40,
    imageUrl: 'https://i.ibb.co/7xSvVpRn/Table.png',
    // fallbackColor: [139, 69, 19] // Brown
  },
  // {
  //   id: 'office_chair',
  //   name: 'Office Chair',
  //   width: 32,
  //   height: 32,
  //   imageUrl: 'https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop',
  //   fallbackColor: [74, 74, 74] // Dark gray
  // },
  // {
  //   id: 'plant_pot',
  //   name: 'Office Plant',
  //   width: 24,
  //   height: 32,
  //   imageUrl: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=24&h=32&fit=crop',
  //   fallbackColor: [34, 139, 34] // Forest green
  // },
  {
    id: 'computer_monitor',
    name: 'Computer Monitor',
    width: 28,
    height: 20,
    imageUrl: 'https://i.ibb.co/JRvgJ9Tk/monitor.png',
    fallbackColor: [28, 28, 28] // Very dark gray
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    width: 40,
    height: 60,
    imageUrl: 'https://i.ibb.co/Z66cFpY9/Bookshelf.png',
    fallbackColor: [139, 69, 19] // Brown
  },
  {
    id: 'floor_rug',
    name: 'Floor Rug',
    width: 80,
    height: 54,
    imageUrl: 'https://i.ibb.co/k64XQpZh/Floormat.png',
    fallbackColor: [128, 0, 32] // Dark red
  },
  {
    id: 'kitchen_area',
    name: 'Kitchen Area',
    width: 120,
    height: 100,
    imageUrl: 'https://i.ibb.co/Q3hBD8mN/Kitchen.png',
    fallbackColor: [200, 200, 200] // Light gray
  }
];

// Asset loading utilities
export class AssetLoader {
  private k: any;
  private loadedAssets: Set<string> = new Set();
  private loadPromises: Map<string, Promise<boolean>> = new Map();

  constructor(kaplayInstance: any) {
    this.k = kaplayInstance;
  }

  async loadFurnitureAsset(asset: FurnitureAsset): Promise<boolean> {
    if (this.loadedAssets.has(asset.id)) {
      return true; // Already loaded
    }

    // Check if already loading
    if (this.loadPromises.has(asset.id)) {
      return this.loadPromises.get(asset.id)!;
    }

    const loadPromise = this._loadAsset(asset);
    this.loadPromises.set(asset.id, loadPromise);
    
    const result = await loadPromise;
    this.loadPromises.delete(asset.id);
    
    return result;
  }

  private async _loadAsset(asset: FurnitureAsset): Promise<boolean> {
    try {
      let imageSource: string | undefined;

      // Determine image source priority: base64 > publicPath > imageUrl
      if (asset.base64) {
        imageSource = asset.base64;
      } else if (asset.publicPath) {
        imageSource = asset.publicPath;
      } else if (asset.imageUrl) {
        imageSource = asset.imageUrl;
      }

      if (imageSource) {
        console.log(`🖼️ Loading furniture asset: ${asset.name} from ${imageSource}`);
        
        // Load sprite with timeout
        const loadPromise = this.k.loadSprite(asset.id, imageSource);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Load timeout')), 5000)
        );
        
        await Promise.race([loadPromise, timeoutPromise]);
        this.loadedAssets.add(asset.id);
        console.log(`✅ Successfully loaded: ${asset.name}`);
        return true;
      } else {
        console.warn(`⚠️ No image source provided for ${asset.name}, will use fallback`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to load ${asset.name}:`, error);
      return false;
    }
  }

  async loadAllAssets(): Promise<void> {
    console.log('🎨 Loading furniture assets...');
    
    // Load furniture assets
    const loadPromises = CUSTOM_FURNITURE_ASSETS.map(asset => 
      this.loadFurnitureAsset(asset)
    );

    await Promise.allSettled(loadPromises);
    console.log(`✨ Asset loading complete. Furniture: ${this.loadedAssets.size}/${CUSTOM_FURNITURE_ASSETS.length}`);
  }

  isAssetLoaded(assetId: string): boolean {
    return this.loadedAssets.has(assetId);
  }

  getAssetById(assetId: string): FurnitureAsset | undefined {
    return CUSTOM_FURNITURE_ASSETS.find(asset => asset.id === assetId);
  }

  // Create furniture object with sprite or fallback
  createFurnitureObject(assetId: string, pos: Vec2, scale: number = 1, instanceId?: string): GameObj {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      console.error(`Asset not found: ${assetId}`);
      return this.k.add([this.k.rect(32, 32), this.k.color(128, 128, 128), this.k.pos(pos)]);
    }

    if (this.isAssetLoaded(assetId)) {
      console.log(`🎨 Creating ${asset.name} with sprite`);
      return this.k.add([
        this.k.sprite(assetId),
        this.k.pos(pos),
        this.k.scale(scale),
        this.k.area(),
        this.k.body({ isStatic: true }),
        'furniture',
        assetId,
        ...(instanceId ? [instanceId] : []),
        {
          objectType: assetId,
          instanceId: instanceId,
        }
      ]);
    } else {
      // Use fallback rectangle
      console.log(`🎨 Creating ${asset.name} with fallback`);
      const fallbackColor = asset.fallbackColor || [128, 128, 128];
      return this.k.add([
        this.k.rect(asset.width * scale, asset.height * scale),
        this.k.color(...fallbackColor),
        this.k.pos(pos),
        this.k.area(),
        this.k.body({ isStatic: true }),
        this.k.outline(2, this.k.rgb(50, 50, 50)),
        'furniture',
        assetId,
        ...(instanceId ? [instanceId] : []),
        {
          objectType: assetId,
          instanceId: instanceId,
        }
      ]);
    }
  }

  // Create tiled floor covering the entire screen
  createTiledFloor(width: number, height: number, tileSize: number = 32): void {
    console.log(`🏠 Creating tiled floor: ${width}x${height} with ${tileSize}x${tileSize} tiles`);
    
    const asset = this.getAssetById('floor_tiles');
    if (!asset) {
      console.error('Floor asset not found');
      return;
    }

    // Calculate how many tiles we need
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);

    console.log(`🏠 Creating ${tilesX}x${tilesY} floor tiles`);

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const pos = this.k.vec2(x * tileSize, y * tileSize);
        
        if (this.isAssetLoaded('floor_tiles')) {
          // Use floor tile sprite
          this.k.add([
            this.k.sprite('floor_tiles'),
            this.k.pos(pos),
            this.k.scale(tileSize / asset.width), // Scale to match tile size
            this.k.z(-2), // Behind everything
            'floor',
            {
              objectType: 'floor_tile',
            }
          ]);
        } else {
          // Use fallback rectangle
          const fallbackColor = asset.fallbackColor || [245, 245, 245];
          this.k.add([
            this.k.rect(tileSize, tileSize),
            this.k.color(...fallbackColor),
            this.k.pos(pos),
            this.k.z(-2), // Behind everything
            'floor',
            {
              objectType: 'floor_tile',
            }
          ]);
        }
      }
    }
    
    console.log(`✅ Floor tiles created successfully`);
  }
} 