/**
 * Handles reading from keyboard and different types of game pads and triggering events and commands based off them
 * module control/controlInput
 */

import {motorSpeedCom, armAngleCom, eStop} from "./motor.js";
import {locDoADig, locDoADump, locCancel} from "./location.js";
import {stopAuto} from "./auto.js";
import {VarEvent} from "./event.js";

var gamepadsLoopRunning = false;
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

function startgamepadsLoop(){
    if(!gamepadsLoopRunning){
        gamepadsLoopRunning = true;
        gamepadsLoop();
    } 
}
//gamepads[gamepadsInUse].buttons[i].pressed
//gamepads[gamepadsInUse].axes[i]


function gamepadsLoop(){
    var gamepads = navigator.getGamepads(); //navigator.getgamepads ? : navigator.webkitGetgamepads;
    if (!gamepads){
        return;
    }
    var padMap = null;
    ////console.log(gamepads);

    let gamepad = null;
    for(let pad of gamepads){
        if(pad != null){
            if(pad.id == "Xbox 360 Controller (XInput STANDARD GAMEPAD)"){
                gamepad = pad;
                break;
            }
        }
    }

    if(gamepad != null){
        var x;
        var y;
        var mag;
        var angle;
        if(manualInputEnable.get()){
            //Test for changes in other buttons
        }
        //Test for estop and manual mode buttons
        if(gamepad.buttons[controllerMap.xbox1.buttons.b].pressed){         //1 in button dict
            document.getElementById("b").style.backgroundColor = "green";
            //console.log(gamepad.buttons[controllerMap.xbox1.buttons.b])
            //console.log("Estop");
        } else{
            document.getElementById("b").style.backgroundColor = "red";
        }
        if(gamepad.buttons[controllerMap.xbox1.buttons.a].pressed) { //0 in button dict
            document.getElementById("a").style.backgroundColor = "green";
            //console.log("manualcontrol");
        } else{
            document.getElementById("a").style.backgroundColor = "red";
        }
        if(gamepad.axes[controllerMap.xbox1.axes.leftVert] > 0.1 || gamepad.axes[controllerMap.xbox1.axes.leftHori] > 0.1){    //1 or 0 in axes dict
            y = gamepad.axes[controllerMap.xbox1.axes.leftVert];    //x value of left stick
            x = gamepad.axes[controllerMap.xbox1.axes.leftHori];    //y value of left stick
            mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));       //calculate magnitude of left stick 
            angle = Math.tan(y/x);                                  //calculate angle of left stick
            //console.log("Left mag: " + mag + " Left angle: " + angle);
        } else{
            //document.getElementById("b").style.backgroundColor = "red";
        } 
        if(gamepad.axes[controllerMap.xbox1.axes.rightVert] > 0.1 || gamepad.axes[controllerMap.xbox1.axes.rightHori] > 0.1){  //3 or 2 in axes dict
            y = gamepad.axes[controllerMap.xbox1.axes.rightVert];
            x = gamepad.axes[controllerMap.xbox1.axes.rightHori];
            mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            angle = Math.tan(y/x);
            //console.log("Right mag: " + mag + " Right angle: " + angle);
        } else{
            //document.getElementById("b").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.x].pressed) { //2 in button dict
            document.getElementById("x").style.backgroundColor = "green";
            //console.log("x is pressed");
        } else{
            document.getElementById("x").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.y].pressed) { //3 in button dict
            document.getElementById("y").style.backgroundColor = "green";
            //console.log("y is pressed");
        } else{
            document.getElementById("y").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.leftBump].pressed) { //4 in button dict
            document.getElementById("leftBump").style.backgroundColor = "green";
            //console.log("left bump is pressed");
        } else{
            document.getElementById("leftBump").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.rightBump].pressed) { //5 in button dict
            document.getElementById("rightBump").style.backgroundColor = "green";
            //console.log("right bump is pressed");
        } else{
            document.getElementById("rightBump").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.leftTrigger].pressed) { //6 in button dict
            document.getElementById("leftTrig").style.backgroundColor = "green";
            //console.log("left trigger is pressed");
        } else{
            document.getElementById("leftTrig").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.rightTrigger].pressed) { //7 in button dict
            document.getElementById("rightTrig").style.backgroundColor = "green";
            //console.log("right trigger is pressed");
        } else{
            document.getElementById("rightTrig").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.select].pressed) { //8 in button dict
            document.getElementById("select").style.backgroundColor = "green";
            //console.log("select is pressed");
        } else{
            document.getElementById("select").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.start].pressed) { //9 in button dict
            document.getElementById("start").style.backgroundColor = "green";
            //console.log("start is pressed");
        } else{
            document.getElementById("start").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.leftStick].pressed) { //10 in button dict
            document.getElementById("leftStick").style.backgroundColor = "green";
            //console.log("left stick is pressed");
        } else{
            document.getElementById("leftStick").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.rightStick].pressed) { //11 in button dict
            document.getElementById("rightStick").style.backgroundColor = "green";
            //console.log("right stick is pressed");
        } else{
            document.getElementById("rightStick").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.up].pressed) { //12 in button dict
            document.getElementById("up").style.backgroundColor = "green";
            //console.log("up is pressed");
        } else{
            document.getElementById("up").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.down].pressed) { //13 in button dict
            document.getElementById("down").style.backgroundColor = "green";
            //console.log("down is pressed");
        } else{
            document.getElementById("down").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.left].pressed) { //14 in button dict
            document.getElementById("left").style.backgroundColor = "green";
            //console.log("left is pressed");
        } else{
            document.getElementById("left").style.backgroundColor = "red";
        } 
        if(gamepad.buttons[controllerMap.xbox1.buttons.right].pressed) { //15 in button dict
            document.getElementById("right").style.backgroundColor = "green";
            //console.log("right is pressed");
        } else{
            document.getElementById("right").style.backgroundColor = "red";
        }
        /*
        if(!gamepad.buttons[controllerMap.xbox1.buttons.b].pressed){                               //start of !pressed
            document.getElementById("b").style.backgroundColor = "red";
            //console.log(gamepad.buttons[controllerMap.xbox1.buttons.b])
            //console.log("Estop");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.a].pressed) { //0 in button dict
            document.getElementById("a").style.backgroundColor = "red";
            //console.log("manualcontrol");
        } 
        if(!gamepad.axes[controllerMap.xbox1.axes.leftVert] > 0.1 || !gamepad.axes[controllerMap.xbox1.axes.leftHori] > 0.1){    //1 or 0 in axes dict
            y = 0;    //x value of left stick
            x = 0;    //y value of left stick
            mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));       //calculate magnitude of left stick 
            angle = Math.tan(y/x);                                  //calculate angle of left stick
            //console.log("Left mag: " + mag + " Left angle: " + angle);
        } 
        if(!gamepad.axes[controllerMap.xbox1.axes.rightVert] > 0.1 || !gamepad.axes[controllerMap.xbox1.axes.rightHori] > 0.1){  //3 or 2 in axes dict
            y = 0;
            x = 0;
            mag = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            angle = Math.tan(y/x);
            //console.log("Right mag: " + mag + " Right angle: " + angle);
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.x].pressed) { //2 in button dict
            document.getElementById("x").style.backgroundColor = "red";
            //console.log("x is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.y].pressed) { //3 in button dict
            document.getElementById("y").style.backgroundColor = "red";
            //console.log("y is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.leftBump].pressed) { //4 in button dict
            document.getElementById("leftBump").style.backgroundColor = "red";
            //console.log("left bump is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.rightBump].pressed) { //5 in button dict
            document.getElementById("rightBump").style.backgroundColor = "red";
            //console.log("right bump is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.leftTrigger].pressed) { //6 in button dict
            document.getElementById("leftTrig").style.backgroundColor = "red";
            //console.log("left trigger is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.rightTrigger].pressed) { //7 in button dict
            document.getElementById("rightTrig").style.backgroundColor = "red";
            //console.log("right trigger is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.select].pressed) { //8 in button dict
            document.getElementById("select").style.backgroundColor = "red";
            //console.log("select is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.start].pressed) { //9 in button dict
            document.getElementById("start").style.backgroundColor = "red";
            //console.log("start is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.leftStick].pressed) { //10 in button dict
            document.getElementById("leftStick").style.backgroundColor = "red";
            //console.log("left stick is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.rightStick].pressed) { //11 in button dict
            document.getElementById("rightStick").style.backgroundColor = "red";
            //console.log("right stick is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.up].pressed) { //12 in button dict
            document.getElementById("up").style.backgroundColor = "red";
            //console.log("up is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.down].pressed) { //13 in button dict
            document.getElementById("down").style.backgroundColor = "red";
            //console.log("down is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.left].pressed) { //14 in button dict
            document.getElementById("left").style.backgroundColor = "red";
            //console.log("left is pressed");
        } 
        if(!gamepad.buttons[controllerMap.xbox1.buttons.right].pressed) { //15 in button dict
            document.getElementById("right").style.backgroundColor = "red";
            //console.log("right is pressed");
        }
        */
    }
    if(gamepadsLoopRunning) requestAnimationFrame(gamepadsLoop);
}

startgamepadsLoop();