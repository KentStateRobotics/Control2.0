'''Handles communication with motors and basic movement commands
Will use a serial connection to motor controling arduino
Handles speed and ramping
'''
import wsServer
import serialConn

@wsServer.command('motor')
def setMagicNumbers(deadzone=None, rampTime=None):
    '''Allows remote setting of magic numbers

        Args:
            deadzone (int, optional): Abs value for drive motors that less then will be rounded to 0
            rampTime (float, optional): Time it takes to ramp from 0 to max in seconds
    '''
    pass

@wsServer.clientRPC('motor')
def getMagicNumbers(deadzone, rampTime):
    '''Sends to client the values of wsServer magic numbers

        Args:
            deadzone (int): Abs value for drive motors that less then will be rounded to 0
            rampTime (float): Time it takes to ramp from 0 to max in seconds
    '''
    pass

@wsServer.command('motor')
def setDriveSpeed(right, left, ramping=True):
    '''Set speed of drive motors and start driving

        Args:
            right (int): -128:128 speed for right drive
            left (int): -128:128 speed for left drive
            ramping (bool, optional): apply speed with or without smooth ramping
    '''
    pass

@wsServer.clientRPC('motor')
def getDriveSpeed(right, left):
    '''Sends the speed of the drives to the client

        Args:
            right (int): -128:128 speed for right drive
            left (int): -128:128 speed for left drive
    '''
    pass

@wsServer.command('motor')
def setArmAngle(elbow=None, bucket=None):
    '''Set the angle of the digging arm and bucket
    '''
    pass

@wsServer.clientRPC('motor')
def getArmAngle(elbow, bucket):
    '''Send the angle of the digging arm elbow and bucket
    '''
    pass

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
