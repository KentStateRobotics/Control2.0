'''Manages autonomus operation
Uses location to handle finding pit location and moveing robot
Needs to send telemetry info to clients
'''
import location
import remoteEvent

'''Triggers to start automation

    Property:
        hasGravel (bool, optional): is the robot currently carring gravel
'''
startAuto = remoteEvent.remoteEvent("startAuto")

'''Triggers to stop automation
'''
stopAuto = remoteEvent.remoteEvent("stopAuto")

'''Current status of the automaton module

    Property:
        TODO
'''
autoStatus = remoteEvent.remoteVarEvent("autoStatus", {})