import event
import wsServer
import json

def _remoteEventHandler(client, message):
    try:
        message = json.loads(message)
        if(message["id"] in remoteEvent._remoteEvents):
            if("evt" in message):
                remoteEvent._remoteEvents[message["id"]](client, message["evt"])
            else:
                remoteEvent._remoteEvents[message["id"]](client, None)
    except ValueError as e:
        print(e)
        
_wsServer = wsServer.wsServer(4242, _remoteEventHandler)

class remoteEvent(event.event):

    _remoteEvents = {}

    def __init__(self, id):
        super().__init__()
        self.id = id
        self._remoteEvents[id] = self._remoteTrigger
    
    def trigger(self, client=None, evt=None):
        data = {}
        data['id'] = self.id
        data['evt'] = evt
        if(client):
            client.send(json.dumps(data))
        else:
            _wsServer.send(json.dumps(data))
        for handler in self._handlers:
            handler(client, evt)

    def _remoteTrigger(self, client, evt):
        for handler in self._handlers:
            handler(client, evt)

class remoteVarEvent(remoteEvent):
    def __init__(self, id, attribute):
        super().__init__(id)
        self.attribute = attribute
    
    def trigger(self):
        super().trigger(evt=self.attribute)

    def set(self, value):
        self._set(value)
        super().trigger(evt=self.attribute)

    def _set(self, value):
        if(type(value) == "dict"):
            for key in value.keys():
                self.attribute[key] = value[key]
        else:
            self.attribute = value

    def _remoteTrigger(self, client, value):
        if value:
            self._set(value)
        super()._remoteTrigger(client, self.attribute)

    def get(self):
        return self.attribute