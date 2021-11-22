import { ITextStyle, Text, TextStyle } from "pixi.js";
import { Tween } from "@tweenjs/tween.js";

export default class TextElement extends Text {
    constructor(text:string,style?: Partial<ITextStyle> | TextStyle | undefined, canvas?: HTMLCanvasElement | undefined){
        super(text, style);
        this.anchor.set(0.5, 0.5);
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
}