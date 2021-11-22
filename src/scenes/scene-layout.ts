import { Container } from "@pixi/display";
import { StateMachineManager, STATE_MACHINE_STATES } from "../managers/state-machine-manager";
import * as typedi from 'typedi';
import { SceneManager } from "../managers/scene-manager";
import { Tween } from "@tweenjs/tween.js";
export class SceneLayout extends Container {
    protected stateMachineManager: StateMachineManager
    protected sceneManager: SceneManager
    constructor(name:string){
        super();
        this.stateMachineManager = typedi.Container.get(StateMachineManager);
        this.sceneManager = typedi.Container.get(SceneManager);
        this.visible = false;
        this.name = name;
    }

    /**
     * Shows scene layout
     * @returns  
     */
    public show(){
        if(this.visible)
            return;
        this.fadeIn();
        this.stateMachineManager.addListener(this.name, this.onStateChange.bind(this))
    }

    /**
     * Hides scene layout
     * @returns  
     */
    public hide(){
        if(!this.visible)
            return;
        this.fadeOut();
        this.stateMachineManager.removeListener(this.name);
    }

    /**
     * Fades in
     * @param [ms] 
     * @param [cb] 
     */
    fadeIn(ms:number = 500, cb:Function = ()=>{}){
        this.visible= true;
        this.alpha = 0;
        new Tween(this)
        .to({ alpha: 1}, ms)
        .onComplete(() => {cb();})
        .start();
    }

    /**
     * Fades out
     * @param [ms] 
     * @param [cb] 
     */
    fadeOut(ms:number = 500, cb:Function = ()=>{}){
        new Tween(this)
        .to({ alpha: 0}, ms)
        .onComplete(() => {cb(); this.visible = false;})
        .start();
    }

    /**
     * Determines whether state change on
     * @param state 
     */
    protected onStateChange(state: STATE_MACHINE_STATES){
    }

}