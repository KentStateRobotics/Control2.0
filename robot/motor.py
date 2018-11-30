'''Handles communication with motors and basic movement commands
Will use a serial connection to motor controling arduino
Handles speed and ramping
'''
import remoteEvent
import serialConn

'''Allows remote setting of magic numbers

    Properties:
        deadzone (int): Abs value for drive motors that less then will be rounded to 0
        rampTime (float): Time it takes to ramp from 0 to max in seconds
'''
motorSettings = remoteEvent.RemoteVarEvent("motorSettings", {"deadzone": 0, "rampTime": 0, "ramping": True})

'''Current speed of the motors

    Properties:
        port (float): -1:1 Speed of port motors
        star (float): -1:1 Speed of starboard motors
'''
motorSpeed = remoteEvent.RemoteVarEvent("motorSpeed", {"port": 0, "star": 0})

'''Target speed of the motors

    Properties:
        port (float): -1:1 Target speed of port motors
        star (float): -1:1 Target speed of starboard motors
'''
motorSpeedCom = remoteEvent.RemoteVarEvent("motorSpeedCom", {"port": 0, "star": 0})

'''Postioton of arm and bucket

    Properties:
        elbow (int): angular position for arm
        bucket (int): angular position for bucket
'''
armAngle = remoteEvent.RemoteVarEvent("armAngle", {"elbow": 0, "bucket": 0})

'''Target postioton of arm and bucket

    Properties:
        elbow (int): Target angular position for arm
        bucket (int): Target angular position for bucket
'''
armAngleCom = remoteEvent.RemoteVarEvent("armAngleCom", {"elbow": 0, "bucket": 0})

'''Emergency stop for all motors and will ignore all move commands until released
'''
motorStop = remoteEvent.RemoteVarEvent("motorStop", False)
