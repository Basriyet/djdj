import Phaser from 'phaser';
import { ValueNoise2D } from './Noise';
import { TextureFactory, TileKey } from './TextureFactory';

export type TileType = 0 | 1 | 2 | 3 | 4 | 5; // grass, dirt, water, sand, rock, forest

export class World {
  readonly width: number;
  readonly height: number;
  readonly tileSize: number;
  readonly tiles: TileType[];
  readonly seed: number;

  constructor(width: number, height: number, tileSize: number, seed: number) {
    this.width = width; this.height = height; this.tileSize = tileSize; this.seed = seed;
    this.tiles = new Array(width * height).fill(0) as TileType[];
  }

  index(x: number, y: number): number { return y * this.width + x; }
  inBounds(x: number, y: number): boolean { return x >= 0 && y >= 0 && x < this.width && y < this.height; }

  generate(): void {
    const noise = new ValueNoise2D(this.seed);
    const moisture = new ValueNoise2D(this.seed ^ 0x9E3779B1);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nx = x / this.width - 0.5;
        const ny = y / this.height - 0.5;
        const d = Math.hypot(nx, ny) * 1.2; // island falloff
        const h = noise.fbm(x / 32, y / 32, 5, 2, 0.5) - d + 0.2;
        const m = (moisture.fbm(x / 48, y / 48, 4, 2, 0.5) + 1) / 2;
        let t: TileType;
        if (h < 0.05) t = 2; // water
        else if (h < 0.08) t = 3; // sand
        else if (h > 0.5 && m < 0.35) t = 4; // rock
        else if (m > 0.6) t = 5; // forest
        else if (m > 0.4) t = 0; // grass
        else t = 1; // dirt
        this.tiles[this.index(x, y)] = t;
      }
    }
  }

  tileToKey(t: TileType): TileKey {
    switch (t) {
      case 0: return 'grass';
      case 1: return 'dirt';
      case 2: return 'water';
      case 3: return 'sand';
      case 4: return 'rock';
      case 5: return 'forest';
    }
  }

  draw(rt: Phaser.GameObjects.RenderTexture, textures: TextureFactory): void {
    const s = this.tileSize;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const t = this.tiles[this.index(x, y)];
        rt.draw(textures.key(this.tileToKey(t)), x * s, y * s);
      }
    }
  }
}
