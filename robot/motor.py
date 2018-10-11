'''Handles communication with motors and basic movement commands
Will use a serial connection to motor controling arduino
Handles speed and ramping
'''
import wsServer
import serialConn

@wsServer.command('motor')
def setMagicNumbers(deadzone, rampTime):
    '''Allows remote setting of magic numbers

        Args:
            deadzone (int): Abs value for drive motors that less then will be rounded to 0
            rampTime (float): Time it takes to ramp from 0 to max in seconds
    '''
    pass

@wsServer.queryHandler('motor')
def getMagicNumbers():
    '''Sends to client the values of wsServer magic numbers

        Returns:
            deadzone (int): Abs value for drive motors that less then will be rounded to 0
            rampTime (float): Time it takes to ramp from 0 to max in seconds
    '''
    return (None, None)

@wsServer.command('motor')
def setDriveSpeed(right, left, ramping=True):
    '''Set speed of drive motors and start driving

        Args:
            right (int): -128:128 speed for right drive
            left (int): -128:128 speed for left drive
            ramping (bool, optional): apply speed with or without smooth ramping
    '''
    pass

@wsServer.queryHandler('motor')
def getDriveSpeed():
    '''Sends the speed of the drives to the client

        Returns:
            right (int): -128:128 speed for right drive
            left (int): -128:128 speed for left drive
    '''
    return (None, None)

@wsServer.command('motor')
def setArmAngle(elbow, bucket):
    '''Set the angle of the digging arm and bucket

        Args:
            elbow (int): angular position for arm
            bucket (int): angular position for bucket
    '''
    pass

@wsServer.queryHandler('motor')
def getArmAngle(elbow, bucket):
    '''Send the angle of the digging arm elbow and bucket

        Returns:
            elbow (int): angular position of arm
            bucket (int): angular position of bucket
    '''
    return (None, None)

@wsServer.command('motor')
def stop(release=False):
    '''Emergency stop for all motors and will ignore all move commands until released

        Args:
            release (bool, optional): release the stop
    '''
    pass

@wsServer.clientRPC('motor')
def notifyOfStop():
    '''Notify client that emergency stop has been initiated
    '''
    pass
