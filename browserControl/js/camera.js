/**
 * Communicates with robots cameras
 * @module control/camera
 */
import * as ws from "./wsClient.js";

const _CAM_PORT = 4243;
var _frameRateCap = 10;
const _client = new ws.WsClient(_CAM_PORT);
var _camera = "front";
var _scale = .25;
const _canvas = document.getElementById("cameraView").getContext('2d');
const _error = document.getElementById("cameraError");
const _frameRateDispaly = document.getElementById("camFrameRate");
const _bandwidthDisplay = document.getElementById("camBandwidth");

var curr = Date.now();
var last = Date.now();
var _open = false;

_client.onMessage((evt) => {
    if(evt.data != "1"){
        createImageBitmap(evt.data).then(function(img) {
            _canvas.canvas.width = img.width;
            _canvas.canvas.height = img.height;
            _canvas.canvas.style.maxHeight = window.innerHeight * .5 + "px";
            _canvas.canvas.style.maxWidth = window.innerHeight * .5 * img.width / img.height + "px";
            _canvas.drawImage(img, 0, 0);
            curr = Date.now();
            _frameRateDispaly.innerText = "Frame rate: " + Math.round(1000 / (curr - last));
            _bandwidthDisplay.innerText = "Bandwidth: " + Math.round(6480 * Math.pow(_scale, 1.58) *_frameRateCap) + "kbps";
            last = curr;

        });
    }else{
        document.getElementById("cameraError").style.display = "inherit";
        document.getElementById("cameraErrorText").innerText = "Robot could not open selected camera";
        stopCamera();
    }
});

function startCamera(camera, scale, frameRate){
    _open = true;
    _camera = camera;
    _scale = scale;
    _frameRateCap = frameRate;
    _client.send(_camera + " " + _scale + " " + _frameRateCap);
    document.getElementById("camToggle").value = "stop";
}

function stopCamera(){
    _open = false;
    _client.send("0")
    document.getElementById("camToggle").value = "start";
}

function reconnect(host){
    _client.startConn(host);
}

function changeFrameRate(rate){
    _frameRateCap = rate
    if(_open){
        startCamera(_camera, _scale, _frameRateCap);
    }
    document.getElementById("frameCapValue").innerText = "Frame cap: " + _frameRateCap;
}

function changeQuality(quality){
    _scale = quality;
    if(_open){
        startCamera(_camera, _scale, _frameRateCap);
    }
}

_client.getWsStateEvt().addHandler((evt) => {
    if(evt == 1){
        document.getElementById("cameraError").style.display = "none";
        startCamera(_camera, _scale, _frameRateCap);
    } else {
        _canvas.canvas.height = 0;
        document.getElementById("cameraErrorText").innerText = "Camera connection not established";
        document.getElementById("cameraError").style.display = "inherit";
        stopCamera();
    }
});

document.getElementsByName("camSelect").forEach((radio) => {
    radio.onchange = () => { startCamera(radio.value, _scale, _frameRateCap); }
});

document.getElementsByName("camQuality").forEach((radio) => {
    radio.onchange = () => { changeQuality(radio.value); }
});

document.getElementById("camFrameRange").onchange = () => {
    console.log("Value: " +  document.getElementById("camFrameRange").value);
    changeFrameRate(document.getElementById("camFrameRange").value);
}

document.getElementById("cameraErrorButton").onclick = () => {
    reconnect(document.getElementById("hostAddress").value);
}

document.getElementById("camToggle").onclick = () => {
    if(_open){
        stopCamera();
    } else {
        startCamera(_camera, _scale, _frameRateCap);
    }
    
}

export{startCamera, stopCamera, reconnect};