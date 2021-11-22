import { Application, Ticker } from "pixi.js";
import * as typedi from 'typedi';
import { CanvasManager } from "./canvas-manager";
import { update } from "@tweenjs/tween.js";
@typedi.Service()
export class TickerManager {
  public ticker = Ticker.shared;
  constructor(
    private canvasManager: CanvasManager
  ) {

  }

  /**
   * Creates ticker manager
   */
  public create():void {
    this.ticker.add(()=>{
        update(this.canvasManager.app.ticker.lastTime);
    })
  }
}
