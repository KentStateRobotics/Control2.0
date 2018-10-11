'''Listens for and maintains websocket connections, handles commands

Will create and run in its own thread witch it will block
Uses a pythonisc singleton pattern and does not require creation of a class
Clients will be of a here defined client class that runs an async receive loop
Will define a decoration that will be used to mark command functions and send to a target defined by a target function paramater
'''
import asyncio
import threading
import json
import websockets

PORT = 4242

_wsThread = None
_wsThreadLoop = None
_clients = []
_commands = {}

def stop():
    '''Stops the wsServer, waits for thread to stop
    '''
    global _wsThread
    global _wsThreadLoop
    _wsThreadLoop.close()
    _wsThread.join()
    _wsThread = None
    return True

def start():
    '''Starts the wsServer, begins thread
    '''
    global _wsThread
    if(not _wsThread):
        _wsThread = threading.Thread(target=_start)
        _wsThread.start()

def command(context):
    '''Decorator marks function that can be called on client and runs on server

        Args:
            context (string): name of namespace for command
    '''
    def deco(funct):
        global _commands
        if(not context in _commands):
            _commands[context] = {}
        def decorator(*args, **kwargs):
            return funct(*args)
        _commands[context][funct.__name__] = decorator
        return funct
    return deco

def clientRPC(context):
    '''Decorator marks function that can be called on server and runs one or more clients

        Args:
            context (string): name of namespace for command

        Decorated Function Args:
            accepted keywords: target[websocketClient], blob[bytes]

        If no targets are given it sends to all
        If blob is given then the command will be sent, followed by blob
        Will not send any keyword arguments, make into dictionary to send
    '''
    def deco(funct):
        def decorator(*args, **kwargs):
            global _clients
            data = {}
            data['context'] = context
            data['funct'] = funct.__name__
            data['args'] = list(args)
            for target in kwargs['targets'] if 'targets' in kwargs else _clients:
                target._send(data)
                if('blob' in kwargs):
                    target._send(kwargs['blob'])
            funct(*args)
        return decorator
    return deco

def queryHandler(context):
    '''Decorator marks function that can be queried and send a response

        Args:
            context (string): name of namespace for command

        Decorated Function 
            Args:
                accepted keywords: blob[bytes]
            Returns (Truple): arguments for the querrys callback
        
        Sends to the client and sent to query
        If blob is given then the command will be sent, followed by blob
        Will not send any keyword arguments, make into dictionary to send
    '''
    def deco(funct):
        global _commands
        if(not context in _commands):
            _commands[context] = {}
        def decorator(*args, **kwargs):
            values = funct(*args)
            data = {}
            data['context'] = context
            data['funct'] = funct.__name__
            data['args'] =  list(values) if type(values) is tuple else list(values['args']) if type(values) is dict else values
            kwargs['client']._send(data)
            if(type(values) is dict and 'blob' in values):
                kwargs['client']._send(values['blob'])
        _commands[context][funct.__name__] = decorator
        return funct
    return deco

class websocketClient:
    '''Handles a websocket connction to one client
    ''' 
    def __init__(self, conn):
        self._conn = conn
        self._alive = True

    def _send(self, message):
        '''Sends message to client

            Args:
                message (string or dict or blob): message to be sent
        '''
        global _wsThreadLoop
        try:
            if(type(message) is dict):
                message = json.dumps(message)
            asyncio.run_coroutine_threadsafe(self._conn.send(message), _wsThreadLoop)
        except websockets.exceptions.ConnectionClosed as e:
            print(e)
            self._destory()

    async def _beginReceiveLoop(self):
        while self._alive:
            try:
                message = await self._conn.recv()
                try:
                    message = json.loads(message)
                    print(*message['args'])
                    _commands[message['context']][message['funct']](*message['args'], client=self)
                except ValueError as e:
                    print(e)
            except websockets.exceptions.ConnectionClosed as e:
                print(e)
                self._destory()

    def _destory(self):
        print("destory")
        self._alive = False

def _start():
    global PORT
    global _wsThreadLoop
    _wsThreadLoop = asyncio.new_event_loop()
    asyncio.set_event_loop(_wsThreadLoop)
    try:
        coro = websockets.server.serve(_handleConn, host='', port=PORT, loop=_wsThreadLoop)
        server = _wsThreadLoop.run_until_complete(coro)
    except OSError:
            print("Socket OSError, closeing")
    else:
        _wsThreadLoop.run_forever()
        server.close()
        _wsThreadLoop.run_until_complete(server.wait_closed())
        _wsThreadLoop.close()

async def _handleConn(conn, url):
    global _clients
    client = websocketClient(conn)
    _clients.append(client)
    await client._beginReceiveLoop()

@command('wsTest')
def commandTest(a):
    print("command test: " + str(a))
    clientRPCBlobTest(a, blob="test blob")

@clientRPC('wsTest')
def clientRPCTest(a):
    print("client rpc test: " + str(a))

@clientRPC('wsTest')
def clientRPCBlobTest(a, blob=None):
    print("client rpc blob test: " + str(a))

@queryHandler('wsTest')
def queryTest(a):
    print("query test: " + str(a))
    return (a,)

@queryHandler('wsTest')
def queryBlobTest(a):
    print("query test: " + str(a))
    return {'args': (a,), 'blob': "query test blob"}

start()