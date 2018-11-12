'''Jared Butcher 11/11/2018
dwmAPI
Interacts with a DWM1001 
'''
import serial
import serial.tools.list_ports
import binascii

ports = serial.tools.list_ports.comports()

conn = None

for p in ports:
    if "1366:0105" in p[2]:
        conn = serial.Serial(p[0], 115200, timeout=.1)
        break
        
def send(data):
    conn.write(bytearray(data))


def dwm_pos_get():
    tx = [0x02, 0x00]
    send(tx)
    rx_data = conn.read(18)
    data_cnt = 5
    x = rx_data[data_cnt] + (rx_data[data_cnt+1]<<8) + (rx_data[data_cnt+2]<<16) + (rx_data[data_cnt+3]<<24)
    data_cnt += 4
    y = rx_data[data_cnt] + (rx_data[data_cnt+1]<<8) + (rx_data[data_cnt+2]<<16) + (rx_data[data_cnt+3]<<24)
    data_cnt += 4
    z = rx_data[data_cnt] + (rx_data[data_cnt+1]<<8) + (rx_data[data_cnt+2]<<16) + (rx_data[data_cnt+3]<<24)
    data_cnt += 4
    qf = rx_data[data_cnt]

    print("X: " + str(x))
    print("Y: " + str(y))
    print("Z: " + str(z))
    print("QF: " + str(qf))



LOC_DATA_POS_OFFSET = 3
LOC_DATA_DIST_OFFSET = LOC_DATA_POS_OFFSET+15
def dwm_loc_get():
    txData = [0x0C, 0x00]
    send(txData)
    data = conn.read(256)
    print(data)
    if data and len(data) >= 21:
        dataIndex = LOC_DATA_POS_OFFSET + 2
        #Self position
        if data[LOC_DATA_POS_OFFSET] == 0x41: #DWM1001_TLV_TYPE_POS_XYZ
            selfX = int.from_bytes(data[dataIndex: dataIndex+3], byteorder='little')
            dataIndex += 4
            selfY = int.from_bytes(data[dataIndex: dataIndex+3], byteorder='little')
            dataIndex += 4
            selfZ = int.from_bytes(data[dataIndex: dataIndex+3], byteorder='little')
        
        dataIndex = LOC_DATA_DIST_OFFSET + 3 #3 is offset to start of data
        #Is anchor, record tag positions
        if data[LOC_DATA_DIST_OFFSET] == 0x48: #DWM1001_TLV_TYPE_POS_XYZ
            print("anchor")
            tags = []
            for i in range(0, data[LOC_DATA_DIST_OFFSET + 2]): #2 if offset for number of tags
                tagId = int.from_bytes(data[dataIndex : dataIndex + 7], byteorder='little')
                dataIndex += 8
                tagDistance = int.from_bytes(data[dataIndex : dataIndex + 3], byteorder='little')
                dataIndex += 4
                tagQf = data[dataIndex]
                dataIndex += 1
                tags.append((tagId, tagDistance, tagQf))
            return tags


        #Is Tag, record anchors
        elif data[LOC_DATA_DIST_OFFSET] == 0x49: #DWM1001_TLV_TYPE_RNG_AN_POS_DIST
            print("tag")
            anchors = []
            for i in range(0, data[LOC_DATA_DIST_OFFSET + 2]):
                ancId = int.from_bytes(data[dataIndex : dataIndex + 1], byteorder='little')
                dataIndex += 2
                ancDistance = int.from_bytes(data[dataIndex : dataIndex + 3], byteorder='little')
                dataIndex += 4
                ancDistanceQf = data[dataIndex]
                dataIndex += 1
                ancX = int.from_bytes(data[dataIndex : dataIndex + 3], byteorder='little')
                dataIndex += 4
                ancY = int.from_bytes(data[dataIndex : dataIndex + 3], byteorder='little')
                dataIndex += 4
                ancZ = int.from_bytes(data[dataIndex : dataIndex + 3], byteorder='little')
                dataIndex += 4
                ancPosQf = data[dataIndex]
                dataIndex += 1
                anchors.append((ancId, ancDistance, ancDistanceQf, ancX, ancY, ancZ, ancPosQf))
            return anchors

while True:
    input()
    print(round(dwm_loc_get()[0][1] / 1000, 2))
