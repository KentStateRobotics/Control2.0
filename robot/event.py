'''An event class and a var event class that triggers when value is set
'''
import copy

class Event:
    '''Basic local event that can be triggered with trigger(evt) and passes an object passed when calling trigger to handlers

        Args:
            handler (function(evt), optional): optional inital handler to add
    '''
    def __init__(self, handler=None):
        self._handlers = []
        if handler:
            self.addHandler(handler)

    def trigger(self, evt=None):
        '''Triggers event, calls all attached handlers while passeing the value of evt to them

            Args:
                evt (*, optional): Value to pass to event handlers
        '''
        for handler in self._handlers:
            handler(evt)
    
    def addHandler(self, handler):
        '''Add a handler

            Args:
                handler (function(evt)): handler to add
        '''
        self._handlers.append(handler)

    def rmHandler(self, handler=None):
        '''Remove a handler or, if no handler given, all handlers

            Args:
                handler (function(evt), optional): handler to remove
        '''
        if(handler):
            self._handlers.remove(handler)
        else:
            self._handlers = []

class VarEvent(Event):
    '''Basic local event that can be triggered with trigger(evt) and passes an object being held to handlers

        Args:
            attirbute (*): Thing that will be held, manipulated, and passed to handlers when triggered
            handler (function(evt), optional): optional inital handler to add
    '''
    def __init__(self, attribute, handler=None):
        super().__init__(handler)
        self._attribute = attribute

    def trigger(self):
        '''Triggers event, calls all attached handlers while passing the held value to them
        '''
        super().trigger(self._attribute)

    def set(self, value):
        '''Sets the held value to the given value. If held value and passed values are dictionaries, it will merge them

            Args:
                value (*): Value to modify held value with
        '''
        if(type(value) == "dict"):
            for key in value.keys():
                self._attribute[key] = value[key]
        else:
            self._attribute = value
        super().trigger(self._attribute)

    def get(self):
        '''Gets the held value, passed as pointer to advoid editing

            Returns: held value, as pointer
        '''
        return self._attribute

    def getCopy(self):
        '''Gets the held value, passed as a deep copy

            Returns: deep copy of held value
        '''
        return copy.deepcopy(self._attribute)