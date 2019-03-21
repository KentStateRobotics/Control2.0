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
    xbox1:{
        axes: {
            leftHori: 0,
            leftVert: 1,
            rightHori: 2,
            rightVert: 3
        },
        buttons: {
            a: 0, //Manual control
            b: 1, //Estop
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
        },
        status: {} //Dynamicly used
    }
}

function startGamepadLoop(){
    if(!gamepadLoopRunning){
        gamepadLoopRunning = true;
        gamepadLoop();
    } 
}
//gamepads[gamepadInUse].buttons[i].pressed
//gamepads[gamepadInUse].axes[i]


function gamepadLoop(){
    let gamepads = navigator.getGamepads(); //navigator.getGamepads ? : navigator.webkitGetGamepads;
    gamepad = null;
    padMap = null;
    gamepads.forEach((pad) => { //TODO: Foreach doesn't work here
        if(pad != null){
            gamepad = pad;
            controllerMap.forEach((map) => {
                if(gamepad.id.indexOf(map.config.id) != -1){
                    padMap = map;
                    break;
                }
            });
            break;
        }
    });
    if(gamepad != null){
        if(manualInputEnable.get()){            //ask what do and if can change
            //Test for changes in other buttons
        }
        //Test for estop and manual mode buttons
        if(gamepad.buttons[controllerMap.xbox1.buttons.b]){         //1 in button dict
            //estop message
            print("Estop");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.a]) { //0 in button dict
            print("manualcontrol");
        } else if(gamepad.axes[controllerMap.xbox1.axes.leftVert] != 0 || gamepad.axes[controllerMap.xbox1.axes.leftHori] != 0){    //1 or 0 in axes dict
            var y = gamepad.axes[controllerMap.xbox1.axes.leftVert];    //x value of left stick
            var x = gamepad.axes[controllerMap.xbox1.axes.leftHori];    //y value of left stick
            var mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));       //calculate magnitude of left stick 
            var angle = Math.tan(y/x);                                  //calculate angle of left stick
            print("Left mag: " + mag + " Left angle: " + angle);
        } else if(gamepad.axes[controllerMap.xbox1.axes.rightVert] != 0 || gamepad.axes[controllerMap.xbox1.axes.rightHori] != 0){  //3 or 2 in axes dict
            var y = gamepad.axes[controllerMap.xbox1.axes.rightVert];
            var x = gamepad.axes[controllerMap.xbox1.axes.rightHori];
            var mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            var angle = Math.tan(y/x);
            print("Right mag: " + mag + " Right angle: " + angle);
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.x]) { //2 in button dict
            print("x is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.y]) { //3 in button dict
            print("y is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.leftBump]) { //4 in button dict
            print("left bump is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.rightBump]) { //5 in button dict
            print("right bump is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.leftTrigger]) { //6 in button dict
            print("left trigger is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.rightTrigger]) { //7 in button dict
            print("right trigger is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.select]) { //8 in button dict
            print("select is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.start]) { //9 in button dict
            print("start is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.leftStick]) { //10 in button dict
            print("left stick is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.rightStick]) { //11 in button dict
            print("right stick is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.up]) { //12 in button dict
            print("up is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.down]) { //13 in button dict
            print("down is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.left]) { //14 in button dict
            print("left is pressed");
        } else if(gamepad.buttons[controllerMap.xbox1.buttons.right]) { //15 in button dict
            print("right is pressed");
        }
    }
    if(gamepadLoopRunning) requestAnimationFrame(gamepadLoop);
}

startGamepadLoop();