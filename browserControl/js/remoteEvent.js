/**
 * Provides events and value holding events that sync over network
 * @module control/remoteEvent
 */
'use strict'

import {wsClient} from "./wsClient.js";
import {event, varEvent} from "./event.js";

const _remoteEvents = {};
const _wsConnection = new wsClient(4242);
_wsConnection.onMessage((evt) => {
    try{
        var data = JSON.parse(evt.data);
    }catch(e){
        console.log(e);
    }
    if(data["id"] in _remoteEvents && data){
        _remoteEvents[data["id"]](data["evt"]);
    }
});

class remoteEvent extends event{
    /**@class
     * Used to define events that will be triggered on both client and server
     * @param {string} id - Program unique id for event
     * @param {function(evt)} [handler] - Optional inital handler
     */
    constructor(id, handler=null){
        super(handler);
        this.id = id;
        _remoteEvents[id] = this._remoteTrigger.bind(this);
    }
    /**
     * @returns {varEvent} - Returns event for the state of the websocket client
     */
    static getWsStateEvt(){
        return _wsConnection.getWsStateEvt();
    }
    /**
     * Try to reconnect
     * @param {string} [host] - host to connect to, if not set connect to previously set 
     */
    static reconnect(host=null){
        _wsConnection.startConn(host);
    }
    /**
     * Trigger the event, calling handlers both here and on synced remote
     * @param {*} evt - Value to pass to handler functions
     */
    trigger(evt){
        let data = {};
        data['id'] = this.id;
        data['evt'] = evt;
        _wsConnection.send(JSON.stringify(data));
        super.trigger(evt);
    }
    /**
     * Triggered remotely, updates values and calls handlers
     * @param {*} evt - values to update
     */
    _remoteTrigger(evt){
        super.trigger(evt);
    }
}

class remoteVarEvent extends remoteEvent{
    /**@class
     * Syncs a value between here and remote program, event is triggered when value is set
     * @param {string} id - Program unique id for event
     * @param {*} attribute - Value being held and synced
     * @param {function(evt)} [handler] - Optional inital handler
     */
    constructor(id, attribute, handler=null){
        super(id, handler);
        this.attribute = attribute;
        remoteVarEvent.getWsStateEvt().addHandler((state) => {
            if(state == 1){
                this._getValueFromServer();
            }
        });
        if(remoteVarEvent.getWsStateEvt() == 1){
            this._getValueFromServer();
        }
    }
    /**
     * Triggers event, calls handlers and sends value to server
     */
    trigger(){
        super.trigger(this.attribute);
    }
    /**
     * Update value and trigger events
     * @param {*} attribute - value to update, if object only updates values given
     */
    set(attribute){
        this._set(attribute);
        this.trigger();
    }
    /**
     * @returns The values being held. DO NOT MODIFY VALUES it is a pointer
     */
    get(){
        return this.attribute;
    }
    /**
     * @returns The a deep copy of values being held.
     */
    getCopy(){
        return JSON.parse(JSON.stringify(this.attribute));
    }
    /**
     * Sets values
     * @param {*} attribute - value to update, if object only updates values given
     */
    _set(attribute){
        if(typeof(this.attribute) == "object"){
            Object.keys(attribute).forEach(key => {
                if(key in this.attribute){
                    this.attribute[key] = attribute[key];
                }else {
                    throw "Key not found";
                }
            });
        } else {
            this.attribute = attribute;
        }
    }
    /**
     * Triggered remotely, updates values and calls handlers
     * @param {*} evt - values to update
     */
    _remoteTrigger(evt){
        this._set(evt);
        super._remoteTrigger(evt);
    }
    /**
     * Requests init values from server
     */
    _getValueFromServer(){
        let data = {};
        data['id'] = this.id;
        data['update'] = null;
        _wsConnection.send(JSON.stringify(data));
    }
}

export{remoteEvent, remoteVarEvent};