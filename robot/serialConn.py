'''Communicates directly with arduinos and other serial controlers
Connections will be global
'''
import serial
import serial.tools.list_ports
import threading

ports = list(serial.tools.list_ports.comports())

def start ():
    for p in ports:
        if "Arduino" in p:
            serialConn.serilaConns.append(serialConn(p))

def getSerialConn(id):
    '''Returns a serial connection to a spicific device denoted by id

        Args:
            id (string): identifer of serial device

        Returns (serialConn): connection requested, returns None if none is found
    '''
    for conn in serialConn.serilaConns:
        if (conn.getId() == id): #write get id method 
            return conn
    return None

class serialConn():
    serilaConns = []
    
    def __init__ (self, port):
        self.id = ""
        self.newConn = serial.Serial(port)
        threading.Thread(target = self.findId)

    def getId(self):
        return self.id

    def findId (self, port): #loops to get id from arduino
        ser = serial.Serial()
        ser.port = port
        ser.open()

        while self.id == "":
           self.id = ser.read()

        ser.close()
        pass

    '''Handles one serial connection
    '''
    def send(self, message):
        '''Sends a message to device

            Args:
                message (string): messge to send
        '''
        pass
    
    def addRecCallback(self, callback):
        '''Adds a function to call upown receiving a message

            Args:
                callback (function(id, message)): function to call
                    Args:
                        id (string): assigned identifer of the serial device
                        message (string): received messge
        '''
        pass

    def rmRecCallback(self, callback):
        '''Try to remove callback from functions to call upown receiveing a message

            Args:
                callback (function(id, message)): function to remove
        '''
        pass

    def restablish(self):
        '''Recreate connection and restart arduino device in the process
        '''
        pass

start()