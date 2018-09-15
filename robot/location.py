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
    '''
    pass

@wsServer.clientRPC('location')
def sendPosition(x, y):
    '''Send current positon to client
    '''
    pass

@wsServer.command('location')
def doADig():
    '''Preform the digging operation
    '''
    pass

@wsServer.command('location')
def cancle():
    '''stops anything being done by location module 
    '''
    pass