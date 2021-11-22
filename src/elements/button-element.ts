import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import TextElement from "./text-element";

export class ButtonElement extends Container{
    private border = new Graphics();
    constructor(text:string = "", onClick?:Function){
        super();

        let textElement = new TextElement(text, {fill: "white", fontSize: 100});


        this.border.lineStyle(2, 0xFF00FF, 1);
        this.border.beginFill(0x650A5A, 0.8);

        // bad hardcode 
        this.border.drawRoundedRect(-200, -45, 400, 90, 16);
        this.border.endFill();
        this.addChild(this.border)


        this.addChild(textElement)

        this.active();

        if(onClick){
            this.addListener("pointerdown", ()=>{
                onClick();
            });
        }
    }


    /**
     * Actives button element
     */
    active():void {
        this.buttonMode = true;
        this.interactive = true;
        this.alpha = 1;
    }


    /**
     * Deactives button element
     */
    deactive():void {
        this.buttonMode = false;
        this.interactive = false;
        this.alpha = 0.4;
    }
}