'''Implements cameras
    TODO: Create way to differntiate cameras
'''
import wsServer
import cv2
import numpy
import threading
import time
import math

cameraMap = {
    "front": 0,
    "frontRight": 1,
    "backRight": 2,
    "back": 3,
    "backLeft": 4,
    "frontLeft": 5
}

HEIGHT = 480
WIDTH = 640

_camLock = threading.RLock()
_currentCameraSelect = None
_currentCamera = cv2.VideoCapture()
_frameRate = 0
_scale = 1
_running = False
_client = None
_newCamera = 0
_camThread = threading.Thread()

def _changeScale(scale=None):
    global _scale
    if scale:
        _scale = scale
    with _camLock:
        _currentCamera.set(cv2.CAP_PROP_FRAME_WIDTH, int(WIDTH * _scale))
        _currentCamera.set(cv2.CAP_PROP_FRAME_HEIGHT, int(HEIGHT * _scale))

def getFrame(camera):
    global _currentCamera, _currentCameraSelect
    with _camLock:
        if _currentCameraSelect != camera:
            _currentCameraSelect = camera
            if not camera in cameraMap:
                return None
            _currentCamera.release()
            _currentCamera.open(cameraMap[camera])
            _changeScale(_scale)
        if camera in cameraMap and _currentCamera.isOpened():
            rval, frame = _currentCamera.read()
            #print(_currentCamera.get(cv2.CAP_PROP_FPS))
            #print(_currentCamera.get(cv2.CAP_PROP_FRAME_WIDTH))
            #print(_currentCamera.get(cv2.CAP_PROP_FRAME_HEIGHT))
            if not frame is None:
                try:
                    #if not scale == 1:
                        #frame = cv2.resize(frame, None, fx=scale, fy=scale)
                    rval, frame = cv2.imencode(".jpg", frame)
                    frame = frame.tobytes()
                    return frame
                except Exception as e:
                    print(e)
        _currentCamera.release()
        _currentCameraSelect = None
        return None

def _cameraLoop():
    global _frameRate, _client, _newCamera, _newScale
    while _running:
        if _frameRate != 0: 
            time.sleep(1 / _frameRate)
        frame = getFrame(_newCamera)
        if frame:
            _client.send(frame)

def _handleRequest(client, message):
    global _frameRate, _newCamera, _scale, _client, _running, _camThread, _currentCamera
    if message == "0":
        _running = False
    else:
        _client = client
        try:
            _newCamera, scale, _frameRate = (*message.split(' '),)
            _frameRate = float(_frameRate)
            scale = float(scale)
        except ValueError:
            print("bad message")
            return None
        _changeScale(scale)
        _running = True
        if not _camThread.is_alive():
            _camThread = threading.Thread(target=_cameraLoop)
            _camThread.start()

_wsServer = wsServer.wsServer(4243, _handleRequest)