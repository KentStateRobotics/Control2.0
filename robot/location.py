'''Uses sensor data to locate robot in pit and navigate the robot to locations
Processes image, lidar, and encoder data to find location
Also can automaticly preform basic operations such as scooping and dumping
Command usage of lidar unit though sensor.py
Obstical detection?
'''
import sensor
import remoteEvent

#Location of robot in the pit
pitLoc = remoteEvent.RemoteVarEvent("pitLoc", {"x": 0, "y": 0})

#Location the robot is going to
pitLocCom = remoteEvent.RemoteVarEvent("pitLocComand", {"x": 0, "y": 0})

#Preforms digging operation
locDoADig = remoteEvent.RemoteEvent("locDoADig")

#Cancels current location module operation
locCancel = remoteEvent.RemoteEvent("locCancel")