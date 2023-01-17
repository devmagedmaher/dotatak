import Phaser from 'phaser';
import { API_ROUTES, STORAGE } from './config';
import Connect from './scenes/Connect';
import InGameScene from './scenes/InGame';

(async () => {

    // get random username for first timer
    if (!localStorage.getItem(STORAGE.NAME)) {
        const res = await fetch(API_ROUTES.GET_USERNAME).then(res => res.json())
        localStorage.setItem(STORAGE.NAME, res.username)
    }

    // initialize phaser game instance
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

})();
