import Phaser from 'phaser';
import { TextureFactory } from '../systems/TextureFactory';
import { World } from '../systems/World';
import { DayNightCycle } from '../systems/DayNightCycle';
import { PRNG, hashStringToSeed } from '../systems/Noise';
import { VirtualJoystick } from '../controls/VirtualJoystick';

export class MainScene extends Phaser.Scene {
  private texturesFactory!: TextureFactory;
  private world!: World;
  private rt!: Phaser.GameObjects.RenderTexture;
  private dayNight!: DayNightCycle;
  private player!: Phaser.Physics.Arcade.Image;
  private joystick!: VirtualJoystick;
  private rng!: PRNG;

  private readonly tileSize = 16;
  private readonly worldW = 96;
  private readonly worldH = 96;

  constructor() { super('Main'); }

  create(): void {
    const seedStr = (localStorage.getItem('seed') || 'ArcaneHomestead');
    const seed = hashStringToSeed(seedStr);
    this.rng = new PRNG(seed);

    this.texturesFactory = new TextureFactory(this, this.tileSize);
    this.texturesFactory.ensure();

    this.world = new World(this.worldW, this.worldH, this.tileSize, seed);
    this.world.generate();

    const pixelW = this.worldW * this.tileSize;
    const pixelH = this.worldH * this.tileSize;

    this.rt = this.add.renderTexture(0, 0, pixelW, pixelH).setOrigin(0, 0);
    this.world.draw(this.rt, this.texturesFactory);

    this.player = this.physics.add.image(pixelW / 2, pixelH / 2, 'player');
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setBounds(0, 0, pixelW, pixelH);

    this.dayNight = new DayNightCycle(this, this.scale.width, this.scale.height);
    this.scale.on('resize', () => {
      this.dayNight = new DayNightCycle(this, this.scale.width, this.scale.height);
    });

    this.joystick = new VirtualJoystick(this, 100, this.scale.height - 100, 60);

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      // Right side tap to dash
      if (p.x > this.scale.width * 0.6) {
        const dir = new Phaser.Math.Vector2(this.player.body.velocity.x, this.player.body.velocity.y);
        if (dir.length() > 0.1) {
          dir.normalize().scale(180);
          this.player.body.velocity.add(dir as any);
        }
      }
    });
  }

  update(time: number, delta: number): void {
    const dt = delta / 1000;

    const v = this.joystick.getVector();
    const speed = 90; // px/s
    this.player.setVelocity(v.x * speed, v.y * speed);

    this.dayNight.update(dt);
  }
}
