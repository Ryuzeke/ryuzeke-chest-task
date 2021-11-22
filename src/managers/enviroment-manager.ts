import * as typedi from 'typedi';



@typedi.Service()
export class EnviromentManager {
  public projectPath:string = process.env.NODE_ENV === 'production' ? '/ryuzeke-chest-task': '';
  constructor() {

  }


  /**
   * Gets assets path
   */
  get assetsPath():string {
      return this.projectPath+"/assets/"
  }
}
