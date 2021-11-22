
import { SceneLayout } from "./scene-layout";
import { FireParticleElement } from "../elements/fire-particle-element";
import TextElement from "../elements/text-element";
import { Easing, Tween } from "@tweenjs/tween.js";

export class BonusGameScene extends SceneLayout {
    private fireParticle: FireParticleElement;
    private amountText: TextElement;
    private descriptionText: TextElement;
    constructor(name:string){
        super(name);
        this.fireParticle = new FireParticleElement();
        this.addChild(this.fireParticle);

        this.descriptionText = new TextElement("SUPER WIN", {
            "fontWeight":"bold",
            "align": "center",
            "dropShadow": true,
            "fill": [
                "#fad126",
                "#ff544f"
            ],
            "fontSize": 100,
            "strokeThickness": 5
        })

        this.amountText = new TextElement("$10.000", {
            "fontWeight":"bold",
            "align": "center",
            "dropShadow": true,
            "fill": [
                "#fad126",
                "#ff544f"
            ],
            "fontSize": 150,
            "strokeThickness": 5
        })
        this.amountText.y = 130;

        this.addChild(this.descriptionText);
        this.addChild(this.amountText);
    }

    /**
     * Shows bonus game scene
     */
    public show(){
        super.show();

        this.descriptionText.fadeIn(1500, ()=>{
            this.descriptionText.fadeOut(1000);
        });
        this.amountText.fadeIn();
        this.animateAmountText(this.onCompletePresentation.bind(this));
        this.fireParticle.start();
    }

    /**
     * Hides bonus game scene
     */
    public hide(){
        super.hide();
        this.fireParticle.stop();
    }


    /**
     * Animates amount text
     * @param [onComplete] 
     */
    animateAmountText(onComplete:Function = ()=>{}){
        this.amountText.scale.set(1.5, 1.5);
        new Tween(this.amountText.scale)
        .to({ x: 1, y: 1 }, 1500)
        .easing(Easing.Cubic.Out)
        .onComplete(() => {
            this.amountText.fadeOut(1000, onComplete.bind(this));
        })
        .start();
    }

    /**
     * Determines whether complete presentation on
     */
    onCompletePresentation():void {
        this.sceneManager.hide("bonus-game-scene")
        this.sceneManager.show("main-game-scene")
    }
}