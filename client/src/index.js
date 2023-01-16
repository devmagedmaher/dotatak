import Phaser from 'phaser';
import Connect from './scenes/Connect';
import InGameScene from './scenes/InGame';
import generateMeaningfulUniqueName from './utils/generate-meaningful-unique-name';

if (!localStorage.getItem('_name')) {
    localStorage.setItem('_name', generateMeaningfulUniqueName())
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        Connect,
        InGameScene
    ]
});