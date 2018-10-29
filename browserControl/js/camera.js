/**
 * Communicates with robots cameras
 * @module control/camera
 */
import * as ws from "./wsClient.js";

const _CAM_PORT = 4243;
const _client = new ws.wsClient(_CAM_PORT);
var _camera = "0";
var _active = false;
const _canvas = document.getElementById("camera").getContext('2d');
_client.onMessage((evt) => {
    createImageBitmap(evt.data).then(function(img) {
        _canvas.canvas.width = img.width;
        _canvas.canvas.height = img.height;
        _canvas.drawImage(img, 0, 0);
        if(_active){
            requestAnimationFrame(_request);
        }
    });
});

function _request(){
    _client.send(_camera);
}

function startCamera(camera){
    _camera = camera;
    _active = true;
    _request();
}

function stopCamera(){
    _active = false;
}

_client.getWsStateEvt().addHandler((evt) => {
    console.log(evt);
    if(evt == 1){
        startCamera("1");
    }
});


export{startCamera, stopCamera};