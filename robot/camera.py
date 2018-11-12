'''Implements cameras
    TODO: Create way to differntiate cameras
'''
import wsServer
import cv2
import numpy

cameraMap = {
    "north": cv2.VideoCapture(0),
    "northEast": cv2.VideoCapture(1),
    "east": cv2.VideoCapture(2),
    "southEast": cv2.VideoCapture(3),
    "south": cv2.VideoCapture(4),
    "southWest": cv2.VideoCapture(5),
    "west": cv2.VideoCapture(6),
    "northWest": cv2.VideoCapture(7)
}

def getFrame(camera, scale):
    scale = float(scale)
    if camera in cameraMap:
        rval, frame = cameraMap[camera].read()
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
    frame = getFrame(*message.split(' '))
    if frame:
        client.send(frame)
    else:
        client.send("1")

_wsServer = wsServer.wsServer(4243, _sendFrame)