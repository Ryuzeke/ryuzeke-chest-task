import "reflect-metadata"
import { Loader } from "pixi.js";
import * as typedi from 'typedi';
import { CanvasManager, STAGE_SETTINGS_ENUMS } from "./managers/canvas-manager";
import { EnviromentManager } from "./managers/enviroment-manager";
import { TickerManager } from "./managers/ticker-manager";
import { MainGameScene } from "./scenes/main-game-scene";
import { SceneManager } from "./managers/scene-manager";
import { BonusGameScene } from "./scenes/bonus-game-scene";
import { StateMachineManager } from "./managers/state-machine-manager";


const canvasManager = typedi.Container.get(CanvasManager)
const stateMachineManager = typedi.Container.get(StateMachineManager)
const sceneManager = typedi.Container.get(SceneManager)
const tickerManager = typedi.Container.get(TickerManager)
const enviromentManager = typedi.Container.get(EnviromentManager)

function startLoading(){
  Loader.shared.add("chest.png", enviromentManager.assetsPath+"images/chest.png");
  Loader.shared.add("fire.png", enviromentManager.assetsPath+"images/fire.png");
  Loader.shared.add("fire_spark.png", enviromentManager.assetsPath+"images/fire_spark.png");
  Loader.shared.load(onLoadComplete);
}

function onLoadComplete(): void {
  sceneManager.addScene("main-game-scene", new MainGameScene("main-game-scene"), 160, 400)
  sceneManager.show("main-game-scene")
  sceneManager.addScene("bonus-game-scene", new BonusGameScene("bonus-game-scene"), 505, 800)
  stateMachineManager.executeListeners();
}


function startGame():void {
  canvasManager.create({
    width: STAGE_SETTINGS_ENUMS.WIDTH,
    height: STAGE_SETTINGS_ENUMS.HEIGHT,
    backgroundColor: 0x0000,
    sharedTicker: true,
    sharedLoader: true,
    backgroundAlpha: 0
  });
  tickerManager.create();
  startLoading();
}

startGame();