'''Handles communication with non-image sensors
Will use a serial connection to communicate with sensor controling arduinos
Will do basic sensor processing so retreved data is usable
Will receive commands for useage of spicifnic sensors ex: location.py rotaing lidar
Will send video to client when requested
'''
import serialConn
import wsServer