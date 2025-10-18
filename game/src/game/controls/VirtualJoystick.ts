import Phaser from 'phaser';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base: Phaser.GameObjects.Image;
  private knob: Phaser.GameObjects.Image;
  private pointerId: number | null = null;
  private origin = new Phaser.Math.Vector2();
  private vector = new Phaser.Math.Vector2();
  private radius: number;

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    this.scene = scene;
    this.radius = radius;
    this.base = scene.add.image(x, y, 'joy_base').setDepth(1000).setScrollFactor(0).setAlpha(0.6);
    this.knob = scene.add.image(x, y, 'joy_knob').setDepth(1001).setScrollFactor(0).setAlpha(0.9);
    this.base.setVisible(false);
    this.knob.setVisible(false);

    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.x > scene.scale.width * 0.5) return; // left half only
      if (this.pointerId !== null) return;
      this.pointerId = p.id;
      this.origin.set(p.x, p.y);
      this.base.setPosition(p.x, p.y).setVisible(true);
      this.knob.setPosition(p.x, p.y).setVisible(true);
    });

    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.pointerId !== p.id) return;
      const dx = p.x - this.origin.x;
      const dy = p.y - this.origin.y;
      const dist = Math.min(Math.hypot(dx, dy), this.radius);
      const ang = Math.atan2(dy, dx);
      this.knob.setPosition(this.origin.x + Math.cos(ang) * dist, this.origin.y + Math.sin(ang) * dist);
      this.vector.set(Math.cos(ang), Math.sin(ang)).scale(dist / this.radius);
    });

    scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (this.pointerId !== p.id) return;
      this.pointerId = null;
      this.vector.set(0, 0);
      this.base.setVisible(false);
      this.knob.setVisible(false);
    });
  }

  getVector(): Phaser.Math.Vector2 { return this.vector.clone(); }
}
