'''Jared Butcher 11/11/2018
dwmAPI
Interacts with a DWM1001 
'''
import serial
import serial.tools.list_ports
import binascii
import threading
import enum
import collections
import time

TIMEOUT = .1
DELAY = .5

@enum.unique
class dwmApiMode(enum.IntEnum):
    '''Defines the 3 modes of operation for position reterival
    '''
    manual = 0, #Do not automaticly pole for postion
    posPole = 1, #pole just for this devices posistion
    fullPole = 2 #pole for all devices postion and distance

@enum.unique
class dwmType(enum.IntEnum):
    tag = 0,
    anchor = 1

pos = collections.namedtuple('pos', ['x', 'y', 'z', 'qf'])
anchor = collections.namedtuple('anchor', ['id', 'distance', 'disanceQf', 'pos'])
tag = collections.namedtuple('tag', ['id', 'distance', 'distanceQf'])

class dwmAPI:
    '''Interacts with a single dwm1001 module, will manage keeping positon and distances. Can automaticly pole module in sperate thread to update values

        Args:
            mode [dwmApiMode]: mode of updateing values
            device [string]: serial device to connect to, if not set finds first dwm1001
    '''

    def __init__(self, mode=dwmApiMode.manual, device=None):
        self._conn = serial.Serial(baudrate=115200, timeout=TIMEOUT)
        self._device = device
        self._connect()
        self._pos = pos(0, 0, 0, 0)
        self._tags = []
        self._anchors = []
        self._type = None
        self._lock = threading.RLock()
        self._poleThread = threading.Thread(target=self._pole)
        self._mode = None
        self.setMode(mode)

    def _connect(self):
        if self._device == None:
            for port in serial.tools.list_ports.comports():
                if "1366:0105" in port[2]:
                    self._conn.port = port[0]
                    break
        else:
            self._conn.port = self._device
        self._conn.open()
        if not self._conn.is_open:
            raise serial.SerialException("Could not connect to port")

    def _send(self, data):
        if not self._conn.is_open:
            self._connect()
        self._conn.write(bytes(data)) 

    def _receive(self, tlvs=1, length=0):
        if not self._conn.is_open:
            self._connect()
        if length != 0:
            return self._conn.read(length)
        else:
            data = []
            for tlv in range(0, tlvs):
                header = self._conn.read(2)
                if len(header) == 2:
                    data.append((header, self._conn.read(header[1])))
            if len(data) >= 1 and len(data[0]) == 2 and len(data[0][1]) == 1 and data[0][1][0] == 0x00:
                return data
            else:
                return None

    def _pole(self):
        while True:
            if self._mode == dwmApiMode.posPole:
                self.dwmPosGet()
            elif self._mode == dwmApiMode.fullPole:
                self.dwmLocGet()
            else:
                break;
            time.sleep(DELAY)

    def setMode(self, mode):
        '''Sets the mode of operation, will start up thread for the non-manual modes
        '''
        self._mode = mode
        if mode != dwmApiMode.manual and not self._poleThread.is_alive():
            self._poleThread = threading.Thread(target=self._pole)
            self._poleThread.start()
        
    def getMode(self):
        return self._mode

    def getSelfPos(self):
        '''Returns: positon and quality factor of this module
        '''
        with self._lock:
            return self._pos

    def getTags(self):
        '''Only updated by dwmLocGet if this module is an anchor

            Returns: list of tags
        '''
        with self._lock:
            return list.copy(self._tags)

    def getAnchors(self):
        '''Only updated by dwmLocGet if this module is an tag
        
            Returns: list of anchors
        '''
        with self._lock:
            return list.copy(self._anchors)

    def getType(self):
        '''Finds if this module is an anchor or tag, if it doesn't know, will run dwmLocGet to find out

            Returns: dwmType
        '''
        if self._type == None:
            self.dwmLocGet()
        return self._type

    def dwmPosGet(self):
        '''Querries for and updates this modules postion
        '''
        tx = [0x02, 0x00]
        self._send(tx)
        rxData = self._receive(2)
        if rxData:
            dataIndex = 0
            x = int.from_bytes(rxData[1][1][dataIndex: dataIndex + 3], byteorder="little")
            dataIndex += 4
            y = int.from_bytes(rxData[1][1][dataIndex: dataIndex + 3], byteorder="little")
            dataIndex += 4
            z = int.from_bytes(rxData[1][1][dataIndex: dataIndex + 3], byteorder="little")
            dataIndex += 4
            qf = rxData[1][1][dataIndex]
            with self._lock:
                self._pos = pos(x, y, z, qf)
            return True
        return False

    def dwmLocGet(self):
        '''Qurries for and updates this modules postion as well as makes a list of all connected tags or anchors
            If module is tag, builds list of anchors, distances to them, and there positons
            If module is anchor, builds list of tags and distances to them
        '''
        LOC_DATA_POS_OFFSET = 3
        LOC_DATA_DIST_OFFSET = LOC_DATA_POS_OFFSET+15
        txData = [0x0C, 0x00]
        with self._lock:
            self._send(txData)
            data = self._receive(3)
            if data:
                dataIndex = 0
                #Self position
                if data[1][0][0] == 0x41: #DWM1001_TLV_TYPE_POS_XYZ
                    x = int.from_bytes(data[1][1][dataIndex: dataIndex+3], byteorder='little')
                    dataIndex += 4
                    y = int.from_bytes(data[1][1][dataIndex: dataIndex+3], byteorder='little')
                    dataIndex += 4
                    z = int.from_bytes(data[1][1][dataIndex: dataIndex+3], byteorder='little')
                    qf = data[1][1][dataIndex]
                    self._pos = pos(x, y, z, qf)

                dataIndex = 1 #Skip the number of distances encoded in the value value
                #Is anchor, record tag positions
                if data[2][0][0] == 0x48: #DWM1001_TLV_TYPE_POS_XYZ
                    self._type = dwmType.anchor
                    self._tags = []
                    for i in range(0, data[2][1][0]): #Number of distances encoded in the value value
                        tagId = int.from_bytes(data[2][1][dataIndex : dataIndex + 7], byteorder='little')
                        dataIndex += 8
                        tagDistance = int.from_bytes(data[2][1][dataIndex : dataIndex + 3], byteorder='little')
                        dataIndex += 4
                        tagQf = data[2][1][dataIndex]
                        dataIndex += 1
                        self._tags.append(tag(tagId, tagDistance, tagQf))
                #Is Tag, record anchors
                elif data[2][0][0] == 0x49: #DWM1001_TLV_TYPE_RNG_AN_POS_DIST
                    self._type = dwmType.tag
                    self._anchors = []
                    for i in range(0, data[2][1][0]): #Number of distances encoded in the value value
                        ancId = int.from_bytes(data[2][1][dataIndex : dataIndex + 1], byteorder='little')
                        dataIndex += 2
                        ancDistance = int.from_bytes(data[2][1][dataIndex : dataIndex + 3], byteorder='little')
                        dataIndex += 4
                        ancDistanceQf = data[2][1][dataIndex]
                        dataIndex += 1
                        ancX = int.from_bytes(data[2][1][dataIndex : dataIndex + 3], byteorder='little')
                        dataIndex += 4
                        ancY = int.from_bytes(data[2][1][dataIndex : dataIndex + 3], byteorder='little')
                        dataIndex += 4
                        ancZ = int.from_bytes(data[2][1][dataIndex : dataIndex + 3], byteorder='little')
                        dataIndex += 4
                        ancPosQf = data[2][1][dataIndex]
                        dataIndex += 1
                        self._anchors.append(anchor(ancId, ancDistance, ancDistanceQf, pos(ancX, ancY, ancZ, ancPosQf)))
                    return True
            return False