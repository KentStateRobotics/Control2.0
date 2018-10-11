'''Manages autonomus operation
Uses location to handle finding pit location and moveing robot
Needs to send telemetry info to clients
'''
import location
import wsServer

@wsServer.command('auto')
def start(hasGravel):
    '''Starts the autonomy routine

        Args:
            hasGravel (bool): is the robot currently carrying gravel? Tells it wether it need to go dump or go dig first
    '''
    pass

@wsServer.command('auto')
def stop():
    '''Stops autonomus control
    '''
    pass

@wsServer.queryHandler('auto')
def getStatus():
    '''Request for status info

        Returns: status info of somesort
    '''
    return (None)