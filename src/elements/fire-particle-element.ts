import { Container, Loader } from "pixi.js";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { TickerManager } from "../managers/ticker-manager";
import * as typedi from 'typedi';
import { CanvasManager } from "../managers/canvas-manager";

// HARD CODE FIRE PARTICLE
export class FireParticleElement extends Container {
  private emitter!: Emitter;
  private tickerManager: TickerManager;
  private canvasManager: CanvasManager;
  constructor() {
    super();
    const oldConfig = {
      alpha: {
        start: 0,
        end: 1,
      },
      scale: {
        start: 3,
        end: 1,
        minimumScaleMultiplier: 2,
      },
      color: {
        start: "#ffffff",
        end: "#ffffff",
      },
      speed: {
        start: 100,
        end: 20,
        minimumSpeedMultiplier: 1,
      },
      acceleration: {
        x: 1,
        y: 1,
      },
      maxSpeed: 0,
      startRotation: {
        min: 0,
        max: 30,
      },
      noRotation: false,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 0.2,
        max: 0.8,
      },
      blendMode: "normal",
      frequency: 0.001,
      emitterLifetime: -1,
      maxParticles: 100,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: true,
      spawnType: "ring",
      spawnCircle: {
        x: 5,
        y: 1,
        r: 100,
        minR: 5,
      },
    };
    this.emitter = new Emitter(
      this,
      upgradeConfig(oldConfig, [Loader.shared.resources["fire.png"].texture, Loader.shared.resources["fire_spark.png"].texture])
    );
    this.tickerManager = typedi.Container.get(TickerManager);
    this.canvasManager = typedi.Container.get(CanvasManager);
    this.stop();
  }

  /**
   * Updates from master ticker
   * @param lasttime
   */
  public update(lasttime: number) {
    this.emitter.update(this.canvasManager.app.ticker.elapsedMS * 0.001);
  }

  /**
   * Starts fire
   */
  start(): void {
    this.emitter.emit = true;
    this.tickerManager.ticker.add(this.update, this);
  }

  /**
   * Stops fire
   */
  stop(): void {
    this.emitter.emit = false;
    this.tickerManager.ticker.remove(this.update, this);
  }
}