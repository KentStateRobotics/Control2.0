/**
 * Communicates with robots cameras
 * @module control/camera
 */
import * as ws from "./wsClient.js";

const _CAM_PORT = 4243;
const _client = new ws.wsClient(_CAM_PORT);
var _camera = "front";
var _active = false;
const _canvas = document.getElementById("camera").getContext('2d');
const _error = document.getElementById("cameraError");
_client.onMessage((evt) => {
    if(evt.data != "1"){
        createImageBitmap(evt.data).then(function(img) {
            _canvas.canvas.width = img.width;
            _canvas.canvas.height = img.height;
            _canvas.drawImage(img, 0, 0);
            if(_active){
                requestAnimationFrame(_request);
            }
            
        });
        _error.style.display = "none";
    }else{
        _canvas.canvas.width = _canvas.canvas.clientWidth;
        _canvas.canvas.height = _canvas.canvas.clientHeight;
        _canvas.font = "40px Arial";
        _canvas.textAlign = "center";
        _canvas.fillText("Camera failed to open", _canvas.canvas.width/2, _canvas.canvas.height/2);
    }
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
    if(evt == 1){
        startCamera(_camera);
    }
});


export{startCamera, stopCamera};