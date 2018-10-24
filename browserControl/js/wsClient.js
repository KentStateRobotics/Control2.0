/**
 * Handles establishing a websocket connection and commands
 * Automaticly tries to connect to the window address when imported
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */
'use strict'

import {varEvent} from "./event.js";

const _TIMEOUT = 1000;
const _RETRIES = 3;

class wsClient{
    
    /**@class
     * Establishes the connection
     * @param {int} port - Port to connect to
     * @param {string} host - Address of host 
     */
    constructor(port, host=window.location.hostname){
        this._port = port;
        this._host = host;
        this._connFailueCounter = 0;
        this._wsStateEvt = new varEvent(0);
        this._start();
    }
    /**
     * Event launched when websocket opens or closes
     * 0 - Connecting
     * 1 - Open
     * 2 - Closeing
     * 3 - Closed
     */
    getWsStateEvt(){
        return this._wsStateEvt;
    }
    onMessage(funct){
        this._wsConnection.onmessage = funct;
    }
    close(){
        this._wsConnection.close();
    }
    send(message){
        this._wsConnection.send(message);
    }
    _start(){
        this._wsConnection = new WebSocket("ws://" + this._host + ":" + this._port);
        this._wsConnection.onopen = (evt) => {
            this._connFailueCounter = 0;
            this._wsStateEvt.set(this._wsConnection.readyState);
        };
        this._wsConnection.onclose = (evt) => {
            console.log(evt);
            ++this._connFailueCounter;
            if(this._connFailueCounter > _RETRIES){
                setTimeout(start, _TIMEOUT);
            } else {
                this._wsStateEvt.set(this._wsConnection.readyState);
            }
        }
    }
}

export {wsClient};