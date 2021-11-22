import { Container } from "@pixi/display";
import { ButtonElement } from "../elements/button-element";
import { ChestElement } from "../elements/chest-element";
import * as typedi from 'typedi';
import { StateMachineManager, STATE_MACHINE_STATES } from "../managers/state-machine-manager";
import { SceneLayout } from "./scene-layout";

export class MainGameScene extends SceneLayout {
    protected chestsContainer: Container = new Container();
    protected playButton: ButtonElement;
    protected chestsLength: number = 9;
    protected currentOpennedChests: number = 0;

    constructor(name:string){
        super(name);
        this.addChild(this.chestsContainer);
        this.generateChests.call(this);
        this.playButton = new ButtonElement("PLAY", ()=>{
            this.stateMachineManager.changeState(STATE_MACHINE_STATES.ON_BETTING_START)
        });
        this.playButton.x = 380;
        this.playButton.y = 1200;
        this.addChild(this.playButton);
    }

    public show(){
        super.show();
        if(this.currentOpennedChests !== 0){
            this.chestsContainer.interactiveChildren = true;
        }
    }

    /**
     * Generates chests
     */
    protected generateChests():void {
        let row = -1;
        for(let i=0;i<this.chestsLength; i++){
            let chest = new ChestElement();
            let column = (i%3)+0;
            if(column === 0){
                row++
            }
            chest.x = 380 * column;
            chest.y = 400 * row;
            this.chestsContainer.addChild(chest);
        }
    }


    /**
     * Determines whether state change on
     * @param state 
     */
    onStateChange(state: STATE_MACHINE_STATES){
        switch (state) {
            case STATE_MACHINE_STATES.IDLE:
                this.playButton.active();
                this.chestsContainer.alpha = 0.3;
                this.chestsContainer.interactiveChildren = false;
                break;

            case STATE_MACHINE_STATES.ON_BETTING_START:
                this.currentOpennedChests = 0;
                this.chestsContainer.alpha = 1;
                this.chestsContainer.interactiveChildren = true;
                this.playButton.deactive();
                break;

            case STATE_MACHINE_STATES.ON_ROUND_START:
                this.chestsContainer.interactiveChildren = false;
                break;

            case STATE_MACHINE_STATES.ON_ROUND_END:
                this.chestsContainer.interactiveChildren = true;
                this.currentOpennedChests++;
                if(this.currentOpennedChests === this.chestsLength){
                    this.onStateChange(STATE_MACHINE_STATES.ON_BETTING_STOP)
                }
                break;

            case STATE_MACHINE_STATES.ON_BETTING_STOP:
                this.chestsContainer.interactiveChildren = false;

                // set timeout/interval should be connected with pixi ticker, just didn't had time
                setTimeout(() => {
                    this.chestsContainer.children.forEach(chest => {
                        (chest as ChestElement).goToNextState();
                    });
                    this.onStateChange(STATE_MACHINE_STATES.IDLE)
                }, 2000);
                break;
        
            default:
                break;
        }
    }
}