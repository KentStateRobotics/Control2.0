'''Implements cameras
'''
import wsServer
import cv2
import numpy

#cv2.namedWindow('video')

video = cv2.VideoCapture(0)

'''
if video.isOpened():
    rval, frame = video.read()
else:
    rval = False
'''

def sendFrame(client, message):
    if message == '1':
        #cv2.imshow('video', frame)
        rval, frame = video.read()
        #cv2.imwrite("frame.jpg", frame)
        #f=open("frame.jpg", "rb")
        #client.send(f.read())
        rval, frame = cv2.imencode(".jpg", frame)
        frame = frame.tobytes()
        #client.send(json.dumps({'a':str(frame)}))
        client.send(frame)
        #key = cv2.waitKey(20)
        #if key == 27:
        #    break

_wsServer = wsServer.wsServer(4243, sendFrame)

#cv2.destroyWindow('video')