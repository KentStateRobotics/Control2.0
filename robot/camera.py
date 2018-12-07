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

currentCameraSelect = None
currentCamera = cv2.VideoCapture()

def getFrame(camera, scale):
    global currentCamera, currentCameraSelect
    if currentCameraSelect != camera:
        currentCameraSelect = camera
        if not camera in cameraMap:
            return None
        currentCamera.release()
        currentCamera.open(cameraMap[camera])
        #print(currentCamera.get(cv2.CAP_PROP_FPS))
    scale = float(scale)
    if camera in cameraMap and currentCamera.isOpened():
        rval, frame = currentCamera.read()
        #print(currentCamera.get(cv2.CAP_PROP_FPS))
        #print(currentCamera.get(cv2.CAP_PROP_FRAME_WIDTH))
        #print(currentCamera.get(cv2.CAP_PROP_FRAME_HEIGHT))
        if not frame is None:
            try:
                if not scale == 1:
                    frame = cv2.resize(frame, None, fx=scale, fy=scale)
                rval, frame = cv2.imencode(".jpg", frame)
                frame = frame.tobytes()
                print("send")
                return frame
            except Exception as e:
                print(e)
    currentCamera.release()
    currentCameraSelect = None
    return None

def _sendFrame(client, message):
    print(message)
    camera, res, stamp = (*message.split(' '),)
    try:
        stamp = int(stamp)
    except ValueError:
        stamp = 0
    if stamp + 500 > time.time() * 100:
        frame = getFrame(camera, res)
        if frame:
            client.send(frame)
            return None
    print(time.time() * 100 - (stamp + 2000))
    

def close():
    for cam in cameraMap:
        cam.release()

_wsServer = wsServer.wsServer(4243, _sendFrame)