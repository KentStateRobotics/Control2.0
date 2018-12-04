'''Implements cameras
    TODO: Create way to differntiate cameras
'''
import wsServer
import cv2
import numpy
import threading

cameraMap = {
    "front": 0,
    "frontRight": 1,
    "backRight": 2,
    "back": 3,
    "backLeft": 4,
    "frontLeft": 5
}

cameraLock = threading.Lock()
currentCameraSelect = None
currentCamera = None

def getFrame(camera, scale):
    global currentCamera, currentCameraSelect
    if currentCameraSelect != camera:
        currentCameraSelect = camera
        if not camera in cameraMap:
            print(camera)
            return None
        currentCamera = cv2.VideoCapture(cameraMap[camera])
    scale = float(scale)
    if camera in cameraMap:
        rval, frame = currentCamera.read()
        if not frame is None:
            try:
                if not scale == 1: 
                    frame = cv2.resize(frame, None, fx=scale, fy=scale)
                rval, frame = cv2.imencode(".jpg", frame)
                frame = frame.tobytes()
                return frame
            except Exception as e:
                print(e)
    return None

def _sendFrame(client, message):
    if cameraLock.acquire(False):
        frame = getFrame(*message.split(' '))
        cameraLock.release()
        if frame:
            client.send(frame)
        else:
            client.send("1")
    else:
        client.send("1")

def close():
    for cam in cameraMap:
        cam.release()

_wsServer = wsServer.wsServer(4243, _sendFrame)