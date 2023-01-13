import heroPNG from '../assets/images/hero.png';
import DotHero from '../objects/hero/dot';

export default class InGameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // preload scene assets
    this.load.image('hero', heroPNG);
  }

  create() {
    // add hero to scene
    this.hero = new DotHero(this);
  }

  update() {
    // update hero frame
    this.hero.update()
  }
}