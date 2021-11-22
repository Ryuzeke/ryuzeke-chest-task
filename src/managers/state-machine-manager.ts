import * as typedi from 'typedi';



export enum STATE_MACHINE_STATES {
    IDLE,
    ON_BETTING_START,
    ON_ROUND_START,
    ON_BONUS_SCENE_START,
    ON_BONUS_SCENE_STOP,
    ON_ROUND_END,
    ON_BETTING_STOP
}


// A mini version state machine for this task
@typedi.Service()
export class StateMachineManager {
    private listeners: {[key: string]: Function} = {};
    public currentState: STATE_MACHINE_STATES = STATE_MACHINE_STATES.IDLE;


    /**
     * Adds listener
     * @param id 
     * @param func 
     */
    addListener(id:string, func: Function){
        if(!this.listeners[id])
            this.listeners[id] = func
    }

    /**
     * Removes listener
     * @param id 
     */
    removeListener(id:string){
        delete this.listeners[id];
    }

    /**
     * Changes state
     * @param newState 
     */
    changeState(newState:STATE_MACHINE_STATES){
        this.currentState = newState;
        this.executeListeners();
    }

    /**
     * Executes listeners
     */
    executeListeners():void {
        for (const [listenerName, func] of Object.entries(this.listeners)) {
            func(this.currentState)
        }
    }
}
