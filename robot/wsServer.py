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