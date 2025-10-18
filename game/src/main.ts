import Phaser from 'phaser';
import { MainScene } from './game/scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450
  },
  render: { pixelArt: true, antialias: false },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [MainScene]
};

window.addEventListener('load', () => {
  // eslint-disable-next-line no-new
  new Phaser.Game(config);
});
