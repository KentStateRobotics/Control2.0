/**
 * Handles reading from keyboard and different types of game pads and triggering events and commands based off them
 * @module control/controlInput
 */

 import {motorSpeedCom, armAngleCom, eStop} from "./js/motor.js";
 import {locDoADig, locDoADump, locCancel} from "./js/location.js";
 import {stopAuto} from "./js/auto.js";
 import {VarEvent} from "./js/event.js";

var gamepadLoopRunning = false;
var manualInputEnable = new VarEvent(false, (newMode) => {
    if(newMode){
        stopAuto.trigger(null);
        locCancel.trigger(null);
    }
    motorSpeedCom.set({"port": 0, "star": 0})
});

const controllerMap = {
    ps4:{
        axes: {
            leftHori: 0,
            leftVert: 1,
            rightHori: 2,
            rightVert: 3
        },
        buttons: {
            a: 0,
            b: 1,
            x: 2,
            y: 3,
            leftBump: 4,
            rightBump: 5,
            leftTrigger: 6,
            rightTrigger: 7,
            select: 8,
            start: 9,
            leftStick: 10,
            rightStick: 11,
            up: 12,
            down: 13,
            left: 14,
            right: 15
        },
        config: {
            id: "Wireless Controller",
            threshold: 10
        }
    }
}

function startGamepadLoop(){
    if(!gamepadLoopRunning){
        gamepadLoopRunning = true;
        gamepadLoop();
    } 
}

function gamepadLoop(){
    let gamepads = navigator.getGamepads(); //navigator.getGamepads ? : navigator.webkitGetGamepads;
    gamepad = null;
    gamepads.forEach((pad) => {
        if(pad != null){
            gamepad = pad;
            break;
        }
    });
    if(gamepad != null){
        if(gamepads[gamepadInUse] != null && gamepads[gamepadInUse].id.indexOf() != -1){
            if(manualInputEnable.get()){
                //Test for changes in other buttons
            }
            //Test for estop and manual mode buttons
        }
    }
    if(gamepadLoopRunning) requestAnimationFrame(gamepadLoop);
}

startGamepadLoop();