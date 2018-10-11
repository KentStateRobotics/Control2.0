'''Uses sensor data to locate robot in pit and navigate the robot to locations
Processes image, lidar, and encoder data to find location
Also can automaticly preform basic operations such as scooping and dumping
Command usage of lidar unit though sensor.py
Obstical detection?
'''
import sensor
import wsServer

@wsServer.command('location')
def goTo(x, y):
    '''Drive the robot to point relitive to bin

        Args:
            x (float): x position (width of bin) in meters
            y (float): y position (length of bin) in meters
    '''
    pass

@wsServer.queryHandler('location')
def getPosition(x, y):
    '''Send current positon to client

        Returns:
            x (float): x position (width of bin) in meters
            y (float): y position (length of bin) in meters
    '''
    return (None,None)

@wsServer.command('location')
def doADig():
    '''Preform the digging operation
    '''
    pass

@wsServer.command('location')
def cancel():
    '''stops anything being done by location module 
    '''
    pass