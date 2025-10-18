import Phaser from 'phaser';

export class DayNightCycle {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle;
  private t: number = 0; // [0,1)
  private speed: number; // fraction per second

  constructor(scene: Phaser.Scene, width: number, height: number, speed = 1 / 120) {
    this.scene = scene;
    this.speed = speed; // 2 minutes per full cycle by default
    this.overlay = scene.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0).setDepth(2000).setScrollFactor(0);
  }

  update(dt: number): void {
    this.t = (this.t + this.speed * dt) % 1;
    // Night alpha curve: darkest at t in [0.75, 0.25]
    const night = Math.cos(this.t * Math.PI * 2) * 0.5 + 0.5; // [0,1]
    const alpha = Phaser.Math.Linear(0.1, 0.65, night);
    this.overlay.setAlpha(alpha);
  }
}
