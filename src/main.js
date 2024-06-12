import { Game as MainGame } from "./scenes/Game";
import { AUTO, Scale, Game, CANVAS, Physics } from "phaser";

//  Find out more information about the Game Config at:
//  h   ttps://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: CANVAS,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Scale.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  input: {
    activeInput: 1,
  },
  scene: [MainGame],
};

export default new Game(config);
