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
import event

class websocketClient:
    '''Handles a websocket connction to one client
    ''' 
    def __init__(self, conn, recEvent):
        self._conn = conn
        self._alive = True
        self._recEvent = recEvent
        self._threadLoop = asyncio.get_event_loop()

    def send(self, message):
        '''Sends message to client
            Args:
                message (string or dict or blob): message to be sent
        '''
        try:
            if(type(message) is dict):
                message = json.dumps(message)
            asyncio.run_coroutine_threadsafe(self._conn.send(message), self._threadLoop)
        except websockets.exceptions.ConnectionClosed as e:
            print(e)
            self._destory()

    async def _beginReceiveLoop(self):
        while self._alive:
            try:
                message = await self._conn.recv()
                self._recEvent(self, message)
            except websockets.exceptions.ConnectionClosed as e:
                print(e)
                self._destory()

    def _destory(self):
        print("destory")
        self._alive = False

class wsServer:
    def __init__(self, port, recEvent):
        self._recEvent = recEvent
        self._port = port
        self._thread = threading.Thread(target=self._start)
        self._thread.start()

    def _start(self):
        self._threadLoop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._threadLoop)
        self._clients = []
        try:
            coro = websockets.server.serve(self._handleConn, host='', port=self._port, loop=self._threadLoop)
            server = self._threadLoop.run_until_complete(coro)
        except OSError:
                print("Socket OSError, closeing")
        else:
            self._threadLoop.run_forever()
            server.close()
            self._threadLoop.run_until_complete(server.wait_closed())
            self._threadLoop.close()

    async def _handleConn(self, conn, url):
        client = websocketClient(conn, self._recEvent)
        self._clients.append(client)
        await client._beginReceiveLoop()
    
    def send(self, message):
        for client in self._clients:
            client.send(message)

    def stop(self):
        '''Stops the wsServer, waits for thread to stop
        '''
        self._threadLoop.close()
        self._thread.join()
        self._thread = None
        return True
    