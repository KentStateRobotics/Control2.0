/**
 * Provides events and value holding events that sync over network
 * @module control/remoteEvent
 */
'use strict'

import {wsClient} from "./wsClient.js";
import {event} from "./event.js";

const _remoteEvents = {};
const _wsConnection = new wsClient(4242);
_wsConnection.onMessage((evt) => {
    console.log(evt.data);
    //try{
        let data = JSON.parse(evt.data);
        if(data["id"] in _remoteEvents){
            _remoteEvents[data["id"]](data["evt"]);
        }
    //}catch(e){
    //    console.log(e);
    //}
});


class remoteEvent extends event{

    /**@class
     * Used to define events that will be triggered on both client and server
     * @param {string} id - Program unique id for event
     */
    constructor(id){
        super();
        this.id = id;
        _remoteEvents[id] = this._remoteTrigger.bind(this);
        this.wsStateEvt = _wsConnection.getWsStateEvt();
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
    getWsStateEvt(){
        return this.wsStateEvt;
    }
    _remoteTrigger(evt){
        super.trigger(evt);
    }
}

class remoteVarEvent extends remoteEvent{
    /**@class
     * Syncs a value between here and remote program, event is triggered when value is set
     * @param {string} id - Program unique id for event
     * @param {*} attribute - Value being held and synced
     */
    constructor(id, attribute){
        super(id);
        this.attribute = attribute;
        this.wsStateEvt.addHandler((state) => {
            if(state == 1){
                this._getValueFromServer();
            }
        });
        if(_wsConnection.wsStateEvt == 1){
            this._getValueFromServer();
        }
    }
    /**
     * Triggers event, calls handlers
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
     * @returns Get a deep copy of value being held
     */
    get(){
        //Best way in js to make a deep copy
        return this.attribute;
    }
    test(){
        console.log("test");
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
        this.test();
        this._set(evt);
        super._remoteTrigger(evt);
    }
    _getValueFromServer(){
        let data = {};
        data['id'] = this.id;
        _wsConnection.send(JSON.stringify(data));
    }
}

export{remoteEvent, remoteVarEvent};