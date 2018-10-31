'''Implements cameras
    TODO: Create way to differntiate cameras
'''
import wsServer
import cv2
import numpy

cameraMap = {
    "front": cv2.VideoCapture(0),
    "star": cv2.VideoCapture(1),
    "rear": cv2.VideoCapture(2),
    "port": cv2.VideoCapture(3)
}

def getFrame(camera):
    if camera in cameraMap:
        rval, frame = cameraMap[camera].read()
        if not frame is None:
            try:
                rval, frame = cv2.imencode(".jpg", frame)
                frame = frame.tobytes()
                return frame
            except e:
                print(e)
    return None

def _sendFrame(client, message):
    frame = getFrame(message)
    if frame:
        client.send(frame)
    else:
        client.send("1")



_wsServer = wsServer.wsServer(4243, _sendFrame)
