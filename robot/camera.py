'''Implements cameras
    TODO: Create way to differntiate cameras
'''
import wsServer
import cv2
import numpy
import threading
import time

cameraMap = {
    "front": 0,
    "frontRight": 1,
    "backRight": 2,
    "back": 3,
    "backLeft": 4,
    "frontLeft": 5
}

_camLock = threading.RLock()
_currentCameraSelect = None
_currentCamera = cv2.VideoCapture()
_running = False
_height = 480
_currentHeight = 0
_camera = "front"
_frameRate = 10
_camThread = threading.Thread()

def getFrame(camera, height=0):
    global _currentCamera, _currentCameraSelect, _height, _currentHeight
    if height == 0:
        height = _height
    with _camLock:
        if _currentCameraSelect != camera:
            if not camera in cameraMap:
                return None
            _currentCamera.release()
            _currentCamera.open(cameraMap[camera])
        if height != _currentHeight or _currentCameraSelect != camera:
            _currentHeight = height
            _currentCamera.set(cv2.CAP_PROP_FRAME_WIDTH, 4/3 * _currentHeight)
            _currentCamera.set(cv2.CAP_PROP_FRAME_HEIGHT, _currentHeight)
            print(_currentCamera.get(cv2.CAP_PROP_FRAME_HEIGHT))
        _currentCameraSelect = camera
        if _currentCamera.isOpened():
            rval, frame = _currentCamera.read()
            if not frame is None:
                try:
                    rval, frame = cv2.imencode(".jpg", frame)
                    frame = frame.tobytes()
                    return frame
                except Exception as e:
                    print(e)
        _currentCamera.release()
        _currentCameraSelect = None
        return None

def _cameraLoop(client):
    global _running, _camera, _height, _frameRate
    while _running:
        if _frameRate != 0: 
            time.sleep(1 / _frameRate)
        frame = getFrame(_camera, _height)
        if frame:
            client.send(frame)

def _handleRequest(client, message):
    global _running, _camThread, _height, _camera, _frameRate
    if message == "0":
        _running = False
    else:
        try:
            camera, height, frameRate = (*message.split(' '),)
            frameRate = int(frameRate)
            height = int(height)
            if not camera in cameraMap:
                raise ValueError("camara value not valid")
        except ValueError:
            print("bad message")
            return None
        _frameRate = frameRate
        _height = height
        _camera = camera
        _running = True
        if not _camThread.is_alive():
            _camThread = threading.Thread(target=_cameraLoop, args=(client,))
            _camThread.start()

_wsServer = wsServer.wsServer(4243, _handleRequest)