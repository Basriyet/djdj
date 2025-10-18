import Phaser from 'phaser';

export type TileKey = 'grass' | 'dirt' | 'water' | 'sand' | 'rock' | 'forest';

export class TextureFactory {
  private scene: Phaser.Scene;
  private size: number;

  constructor(scene: Phaser.Scene, size: number) {
    this.scene = scene;
    this.size = size;
  }

  ensure(): void {
    const keys: TileKey[] = ['grass', 'dirt', 'water', 'sand', 'rock', 'forest'];
    for (const k of keys) {
      const texKey = this.key(k);
      if (!this.scene.textures.exists(texKey)) {
        this.makeTile(k);
      }
    }
    if (!this.scene.textures.exists('player')) this.makePlayer();
    if (!this.scene.textures.exists('slime')) this.makeSlime();
    if (!this.scene.textures.exists('joy_base')) this.makeJoyBase();
    if (!this.scene.textures.exists('joy_knob')) this.makeJoyKnob();
  }

  key(k: TileKey): string { return `tile_${k}`; }

  private makeTile(type: TileKey): void {
    const s = this.size;
    const cvs = this.scene.textures.createCanvas(this.key(type), s, s).getSourceImage() as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;

    const fill = (color: string) => { ctx.fillStyle = color; ctx.fillRect(0, 0, s, s); };
    const noise = (color: string, alpha = 0.15) => {
      const img = ctx.getImageData(0, 0, s, s);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (Math.random() * 255) | 0;
        img.data[i + 0] = (img.data[i + 0] * (1 - alpha)) + n * alpha;
        img.data[i + 1] = (img.data[i + 1] * (1 - alpha)) + n * alpha;
        img.data[i + 2] = (img.data[i + 2] * (1 - alpha)) + n * alpha;
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(0, 0, s, s);
      ctx.globalAlpha = 1;
    };

    switch (type) {
      case 'grass':
        fill('#2e8b57'); noise('#3faa6b');
        break;
      case 'dirt':
        fill('#7b5a3a'); noise('#a0724c');
        break;
      case 'water':
        fill('#1e90ff'); noise('#3cb3ff');
        break;
      case 'sand':
        fill('#c2b280'); noise('#e0d1a0');
        break;
      case 'rock':
        fill('#6e6e6e'); noise('#9a9a9a');
        break;
      case 'forest':
        fill('#2f6b3f'); noise('#3f8b4f');
        break;
    }

    // Subtle grid for pixel-art feel
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.lineTo(s, s); ctx.lineTo(0, s); ctx.closePath();
    ctx.stroke();
    this.scene.textures.get(this.key(type)).refresh();
  }

  private makePlayer(): void {
    const s = this.size;
    const cvs = this.scene.textures.createCanvas('player', s, s).getSourceImage() as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = '#8a2be2';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.35, 0, Math.PI * 2);
    ctx.fill();
    this.scene.textures.get('player').refresh();
  }

  private makeSlime(): void {
    const s = this.size;
    const cvs = this.scene.textures.createCanvas('slime', s, s).getSourceImage() as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = '#2dd36f';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#aaffc6';
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2);
    ctx.fill();
    this.scene.textures.get('slime').refresh();
  }

  private makeJoyBase(): void {
    const s = this.size * 3;
    const cvs = this.scene.textures.createCanvas('joy_base', s, s).getSourceImage() as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.45, 0, Math.PI * 2);
    ctx.fill();
    this.scene.textures.get('joy_base').refresh();
  }

  private makeJoyKnob(): void {
    const s = this.size * 1.5;
    const cvs = this.scene.textures.createCanvas('joy_knob', s, s).getSourceImage() as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.45, 0, Math.PI * 2);
    ctx.fill();
    this.scene.textures.get('joy_knob').refresh();
  }
}
