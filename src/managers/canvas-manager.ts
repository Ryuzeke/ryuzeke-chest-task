import { Application, IApplicationOptions } from "pixi.js";
import * as typedi from 'typedi';


export enum STAGE_SETTINGS_ENUMS {
  WIDTH = 1080,
  HEIGHT = 1920
}


@typedi.Service()
export class CanvasManager {
  public app: Application;
  constructor() {
  }

  /**
   * Creates canvas manager
   * @param [options] 
   */
  public create(options?: IApplicationOptions):void {
    this.app = new Application(options);
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
    document.body.appendChild(this.app.view);
  }

  /**
   * Resizes canvas
   */
  private resize(): void {
    var ratio = Math.min(window.innerWidth/STAGE_SETTINGS_ENUMS.WIDTH,window.innerHeight/STAGE_SETTINGS_ENUMS.HEIGHT);
    this.app.stage.scale.x = this.app.stage.scale.y = ratio;
    this.app.renderer.resize(Math.ceil(STAGE_SETTINGS_ENUMS.WIDTH * ratio),Math.ceil(STAGE_SETTINGS_ENUMS.HEIGHT * ratio));
  }

}
