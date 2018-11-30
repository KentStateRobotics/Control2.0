'''Implements network synced events and variables
'''
import event
import wsServer
import json
import copy

def _remoteEventHandler(client, message):
    try:
        print(message)
        message = json.loads(message)
        if(message["id"] in RemoteEvent._remoteEvents):
            if("update" in message):
                RemoteEvent._remoteEvents[message["id"]](client, None)
            else:
                RemoteEvent._remoteEvents[message["id"]](client, message["evt"])
    except ValueError as e:
        print(e)
        
_wsServer = wsServer.wsServer(4242, _remoteEventHandler)

class RemoteEvent(event.Event):
    '''Implements remotly synced events

        Event handlers attached should be in form handler(client, evt) where client is the client that triggered the event if it was triggered remotely

        Args:
            id (string): unique string to identify this event, must match counterpart on client
            hander (function(client, evt), optional): optional inital handler to add
    '''
    def __init__(self, id, handler=None):
        super().__init__(handler)
        self.id = id
        self._remoteEvents[id] = self._distribute
    
    _remoteEvents = {}

    def trigger(self, client=None, evt=None):
        '''Trigers event here and on either client if given or all clients if not. Passes evt value to all handlers

            Args:
                client (wsClient, optional): Client to also trigger event on, if not given triggers on all clients
                evt (*, optional): Value to pass to handlers
        '''
        self._distribute(client, evt)
        self._send(client, evt)

    def _send(self, client, evt):
        '''Sends event trigger to remote client or all clients
        '''
        data = {}
        data['id'] = self.id
        data['evt'] = evt
        if(client):
            client.send(json.dumps(data))
        else:
            _wsServer.send(json.dumps(data))

    def _distribute(self, client, evt):
        '''Calls attached event handlers
        '''
        for handler in self._handlers:
            handler(client, evt)

class RemoteVarEvent(RemoteEvent):
    '''Implements remotly synced variables and update events

        Event handlers attached should be in form handler(client, value) where client is the client that triggered the event if it was triggered remotely

        Args:
            id (string): unique string to identify this event, must match counterpart on client
            attribute (*): any basic type or dictonary to server as default value being held
            hander (function(client, evt), optional): optional inital handler to add
    '''
    def __init__(self, id, attribute, handler=None):
        super().__init__(id, handler)
        self.attribute = attribute
    
    def trigger(self):
        '''Triggers event here and remotly, passing currently held value to event handlers
        '''
        super().trigger(evt=self.attribute)

    def set(self, value):
        '''Updates the held value and triggers the event

            Args:
                value (*): Value to replace held value with or dictionary to merge with held one
        '''
        self._set(value)
        super().trigger(evt=self.attribute)

    def _set(self, value):
        '''Updates value without triggering event
        '''
        if(type(value) == "dict"):
            for key in value.keys():
                self.attribute[key] = value[key]
        else:
            self.attribute = value

    def _distribute(self, client, value):
        '''Updates held value and calls local handlers only. If value is null send currently held value to client
            Is ran when this event is remotely received

            Args:
                client (wsClient): Client event is called from
                value (*): Value to update and trigger with. If it is None then do not trigger and send currently held value to client
        '''
        if value:
            self._set(value)
            super()._distribute(client, self.attribute)
        else:
            super()._send(client, self.attribute)

    def get(self):
        '''Gets held value, is a pointer so do not modify

            Returns: pointer to held value
        '''
        return self.attribute

    def getCopy(self):
        '''Gets deep copy of held value

            Returns: deep copy of held value
        '''
        return copy.deepcopy(self.attribute)