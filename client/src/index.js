import Phaser from 'phaser';
import InGameScene from './scenes/InGame';
import generateMeaningfulUniqueName from './utils/generate-meaningful-unique-name';

if (!localStorage.getItem('_name')) {
    localStorage.setItem('_name', generateMeaningfulUniqueName())
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        InGameScene
    ]
});