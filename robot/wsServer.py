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

def command(context):
    '''Decorator marks function that can be called on client and runs on server

        Args:
            context (string): name of namespace for command

        Decorated Function Args:
            client (websocketClient, optional) contains client message originated from
    '''
    def deco(funct):
        def decorator(*args, **kwargs):
            funct(client=None, *args, **kwargs)
        return decorator
    return deco

def clientRPC(context):
    '''Decorator marks function that can be called on server and runs one or more clients

        Args:
            context (string): name of namespace for command

        Decorated Function Args:
            keyword args: clients to send to
                accepted keywords: target[websocketClient], blob[bytes]
        If no targets are given it sends to all
        If blob is given then the command will be sent, followed by blob
    '''
    def deco(funct):
        def decorator(*args, **kwargs):
            funct(*args, **kwargs)
        return decorator
    return deco

class websocketClient:
    '''Handles a websocket connction to one client
    ''' 

    def _send(self, message, isBlob=False):
        '''Sends message to client

            Args:
                message (string or dict or blob): message to be sent
        '''
        pass

    def _destory(self):
        pass
