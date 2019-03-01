'''Communicates directly with arduinos and other serial controlers
Connections will be global
'''
import serial
import serial.tools.list_ports
import threading

def start ():
    for p in serial.tools.list_ports.comports():
        if "Arduino" in p[1]:
            serialConn.serialConns.append(serialConn(p[0]))
    

def getSerialConn(id):
    '''Returns a serial connection to a spicific device denoted by id

        Args:
            id (string): identifer of serial device

        Returns (serialConn): connection requested, returns None if none is found
    '''
    for conn in serialConn.serialConns:
        if (conn.getId() == id): #write get id method 
            return conn
    return None

class serialConn():
    serialConns = []
    functionsToCall = []

    START = "|"
    END = "|"
    ESCAPE = "~"

    msgIn = ""
    
    def __init__ (self, port):
        self.id = ""
        self.port = port
        self.newConn = serial.Serial(port = self.port, baudrate = 115200)
        self.thread = threading.Thread(target = self.findId)
        self.thread.start()

    def getId(self):
        return self.id

    def findId (self): #loops to get id from arduino
        print("id pre")
        while self.id == "":
           self.id = self.newConn.read()
           print("recived id")
           print(self.id)
        while True: self.recieve()      #opens up to recieve message
        self.send("Test")               #testing send function
        self.newConn.close()
        pass

    def recieve(self):
        print("ready to receive")
        msgIn = self.newConn.read()
        fullMsg = ""
        if msgIn == self.START:
            while True:
                fullMsg += msgIn
                msgIn = self.newConn.read()
                if msgIn == self.END: break

        print("received: ")
        print(fullMsg)
            

    '''Handles one serial connection
    '''
    def send(self, message):
        '''Sends a message to device

            Args:
                message (string): messge to send
        '''
        #need to define how START/end and escape character works
        i = 0
        while True:
            i = message.find(self.START, i)
            if i == -1: break
            message = message[:i] + self.START + message[i:]
            i += 2

        data = self.START + message + self.START + self.END
        self.newConn.write(data)
        pass
    
    def addRecCallback(self, callback):
        '''Adds a function to call upown receiving a message

            Args:
                callback (function(id, message)): function to call
                    Args:
                        id (string): assigned identifer of the serial device
                        message (string): received messge
        '''

        for p in self.serialConns:
            if p.id == callback.id:
                p.functionsToCall.append(p)
        pass

    def rmRecCallback(self, callback):
        '''Try to remove callback from functions to call upown receiveing a message

            Args:
                callback (function(id, message)): function to remove
        '''

        for p in self.functionsToCall:
            if callback == p:
                self.functionsToCall.remove(p)
        pass

    def restablish(self):
        '''Recreate connection and reSTART arduino device in the process
        '''
        pass

start()
input()