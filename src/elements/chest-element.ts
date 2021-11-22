import { Container } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Sprite } from "@pixi/sprite";
import * as typedi from 'typedi';
import { Tween, Easing } from "@tweenjs/tween.js";
import { StateMachineManager, STATE_MACHINE_STATES } from "../managers/state-machine-manager";
import TextElement from "./text-element";
import { SceneManager } from "../managers/scene-manager";

export enum STATES {
    CLOSED = "ChestElementStates.CLOSED",
    OPENNING = "ChestElementStates.OPENNING",
    OPENNED = "ChestElementStates.OPENNED"
}

export enum PRICES {
    LOSS = "PRICE.LOSS",
    NORMAL_WIN = "PRICE.NORMAL.WIN",
    BONUS_WIN = "PRICE.BONUS.WIN"
}


export class ChestElement extends Container{
    private chestSprite: Sprite;
    private stateSteps: STATES[] = [STATES.CLOSED, STATES.OPENNING, STATES.OPENNED]
    private textElement: TextElement;
    private sceneManager: SceneManager;
    private stateMachineManager: StateMachineManager
    private currentStateIndex:number = 0;
    constructor(){
        super();
        this.stateMachineManager = typedi.Container.get(StateMachineManager);
        this.sceneManager = typedi.Container.get(SceneManager);
        this.chestSprite = new Sprite(Loader.shared.resources["chest.png"].texture);
        this.chestSprite.anchor.set(0.5, 0.5);
        this.addListener("click", this.goToNextState.bind(this));
        this.updateState(this.currentState);
    }

    /**
     * Gets current state
     */
    public get currentState():STATES {
        return this.stateSteps[this.currentStateIndex];
    }

    /**
     * Updates state
     * @param newState 
     */
    updateState(newState: STATES){
        switch (newState) {
            case STATES.CLOSED:
                this.removeChild(this.textElement);
                this.addChild(this.chestSprite)
                this.buttonMode = true;
                this.interactive = true;
                break;
            case STATES.OPENNING:
                this.buttonMode = false;
                this.interactive = false;

                // fake percentage array
                let choosingArray = [PRICES.BONUS_WIN, PRICES.LOSS, PRICES.NORMAL_WIN, PRICES.LOSS, PRICES.NORMAL_WIN, PRICES.LOSS, PRICES.LOSS]
                this.oppeningAnimationChooser(choosingArray[Math.floor(Math.random() * choosingArray.length)])
                this.stateMachineManager.changeState(STATE_MACHINE_STATES.ON_ROUND_START)
                break;
            case STATES.OPENNED:
                this.removeChild(this.chestSprite);
                this.chestSprite.alpha = 1;
                this.chestSprite.scale.set(1,1)
                this.stateMachineManager.changeState(STATE_MACHINE_STATES.ON_ROUND_END)
            default:
                break;
        }
    }

    /**
     * Oppening animation chooser
     * @param priceType 
     */
    private oppeningAnimationChooser(priceType: PRICES):void {
        switch (priceType) {
            case PRICES.NORMAL_WIN:
                this.textElement = new TextElement(`won 1000$`, {
                    fill: "green",
                    fontSize: 44,
                    fontWeight:"bold",
                })
                this.oppeningAnimationWin(this.goToNextState.bind(this));
                break;

            case PRICES.LOSS:
                this.textElement = new TextElement(`loss`, {
                    fill: "red",
                    fontSize: 44,
                    fontWeight:"bold",
                })
                this.oppeningAnimationLoss(this.goToNextState.bind(this));
                break;

            case PRICES.BONUS_WIN:
                this.textElement = new TextElement(`BONUS WIN`, {
                    fill: "gold",
                    fontSize: 55,
                    fontWeight:"bold",
                })
                this.oppeningAnimationBonus(()=>{
                    this.goToNextState();
                    this.parent.interactiveChildren = false;
                    this.sceneManager.hide("main-game-scene")
                    this.sceneManager.show("bonus-game-scene")
                });

            default:
                break;
        }
    }


    /**
     * Go to next state
     */
    goToNextState():void{
        this.currentStateIndex++;
        if(this.currentStateIndex >= this.stateSteps.length){
            this.currentStateIndex = 0;
        }
        this.updateState(this.currentState)
    }

    /**
     * Oppening animation win
     * @param [onComplete] 
     */
    private oppeningAnimationWin(onComplete:Function = ()=>{}){
        // scaling animation
        new Tween(this.chestSprite.scale)
        .to({ x: 1, y: 0.8 }, 200)
        .onComplete(() => {
            new Tween(this.chestSprite.scale)
            .to({ x: 0.8, y: 1 }, 200)
            .onComplete(() => {
                this.addChild(this.textElement);
                this.textElement.fadeIn(1000);
                new Tween(this.chestSprite.scale)
                .to({ x: 1.2, y: 1.2 }, 500)
                .start();
            })
            .start();
        })
        .start();

        // angle and opacity animation
        new Tween(this.chestSprite)
        .to({ angle: -20, }, 200)
        .easing(Easing.Cubic.Out)
        .onComplete(() => {
            new Tween(this.chestSprite)
            .to({ angle: 20,}, 200)
            .easing(Easing.Cubic.Out)
            .onComplete(() => {
                new Tween(this.chestSprite)
                .to({ angle: 0, alpha: 0}, 500)
                .easing(Easing.Cubic.Out)
                .onComplete(()=>{
                    onComplete();
                })
                .start();
            })
            .start();
        })
        .start();
    }


    /**
     * Oppening animation loss
     * @param [onComplete] 
     */
    private oppeningAnimationLoss(onComplete:Function = ()=>{}){
        new Tween(this.chestSprite)
        .to({ y: 20, alpha: 0 }, 1000)
        .easing(Easing.Linear.None)
        .onComplete(() => {
            this.addChild(this.textElement);
            this.textElement.fadeIn(1000);
            onComplete();
        })
        .start();
    }

    /**
     * Oppening animation bonus
     * @param [onComplete] 
     */
    private oppeningAnimationBonus(onComplete:Function = ()=>{}){
        let pulse:Function;
        let pulseTimes:number = 0;
        pulse = (scale:number)=>{
            new Tween(this.chestSprite.scale)
            .to({ x: scale, y: scale }, 200)
            .easing(Easing.Linear.None)
            .onComplete(() => {
                pulseTimes++
                if(pulseTimes <= 6){
                    pulse( pulseTimes % 2 ? 0.8 : 1)
                } else {
                    this.oppeningAnimationWin(onComplete)
                }
            })
            .start();
        }
        pulse();
    }
}