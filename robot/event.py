'''An event class and a var event class that triggers when value is set
'''

class event:
    def __init__(self):
        self._handlers = []

    def trigger(self, evt=None):
        for handler in self._handlers:
            handler(evt)
    
    def addHandler(self, handler):
        self._handlers.append(handler)

    def rmHandler(self, handler=None):
        if(handler):
            self._handlers.remove(handler)
        else:
            self._handlers = []

class varEvent(event):
    def __init__(self, attribute):
        super().__init__()
        self._attribute = attribute

    def trigger(self):
        super().trigger(self._attribute)

    def set(self, value):
        if(type(value) == "dict"):
            for key in value.keys():
                self._attribute[key] = value[key]
        else:
            self._attribute = value
        super().trigger(self._attribute)

    def get(self):
        return self._attribute