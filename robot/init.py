'''Start, stop, and restart program and shutdown and restart computer
'''
import os
import threading
import remoteEvent
import camera

testVar = remoteEvent.RemoteVarEvent("InitTestVar", {"a": 5, "b": 6})
def handler(client, attribute):
    print(attribute)
testVar.addHandler(handler)

while True:
    input()
    testVar.set({"a": testVar.get()['a'] + 1})