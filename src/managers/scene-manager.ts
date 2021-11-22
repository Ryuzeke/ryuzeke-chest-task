import { Container } from '@pixi/display';
import * as typedi from 'typedi';
import { MainGameScene } from '../scenes/main-game-scene';
import { SceneLayout } from '../scenes/scene-layout';
import { CanvasManager } from "./canvas-manager";
@typedi.Service()

// hard code scene manager
export class SceneManager {
  private scenes: {[key: string]: SceneLayout} = {}
  constructor(
    private canvasManager: CanvasManager
  ) {

  }

  /**
   * Adds game scene
   * @param id 
   * @param scene 
   * @param [x] 
   * @param [y] 
   */
  addScene(id:string, scene: SceneLayout, x:number=0, y:number=0){
      this.scenes[id] = scene;
      this.canvasManager.app.stage.addChild(scene);
      scene.x = x;
      scene.y = y;
  }


  /**
   * Shows game scene
   * @param id 
   */
  public show(id: string){
      this.scenes[id].show();
  }

  /**
   * Hides game scene
   * @param id 
   */
  public hide(id: string){
    this.scenes[id].hide();
  }
}
