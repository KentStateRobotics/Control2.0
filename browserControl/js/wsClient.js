/**
 * Handles establishing a websocket connection and commands
 * Automaticly tries to connect to the window address when imported
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */
'use strict'

import {VarEvent} from "./event.js";

const _TIMEOUT = 1000;
const _RETRIES = 3;

class WsClient{
    
    /**@class
     * Establishes the connection
     * @param {int} port - Port to connect to
     * @param {string} host - Address of host 
     */
    constructor(port, host=window.location.hostname){
        this._port = port;
        this._host = host;
        this._open = false;
        this._onMessageFunct = null;
        this._connFailueCounter = 0;
        this._wsStateEvt = new VarEvent(0);
        this.startConn();
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
    /**
     * Sets function to handle onmessage event
     * @param {function(evt)} funct - function to handle on message event
     */
    onMessage(funct){
        this._onMessageFunct = funct;
        this._wsConnection.onmessage = funct;
    }
    /**
     * Closes the websocket
     */
    close(){
        open = false;
        this._wsConnection.onclose = null;
        this._wsConnection.close();
        this._wsStateEvt.set(3);
    }
    /**
     * Sends message to server
     * @param {string} message - Message to send
     */
    send(message){
        this._wsConnection.send(message);
    }
    /**
     * Establishes connection
     */
    startConn(host=null){
        if(this._wsConnection){
            this.close();
        }
        if(host){
            this._host = host;
        }
                this.open = true;
        this._wsConnection = new WebSocket("ws://" + this._host + ":" + this._port);
        this._wsConnection.onopen = (evt) => {
            this._connFailueCounter = 0;
            this._wsStateEvt.set(this._wsConnection.readyState);
        };
        this._wsConnection.onclose = (evt) => {
            console.log(evt);
            ++this._connFailueCounter;
            if(this._connFailueCounter > _RETRIES && this.open){
                setTimeout(start, _TIMEOUT);
            } else {
                this._wsStateEvt.set(this._wsConnection.readyState);
            }
        };
        if(this._onMessageFunct){
            this._wsConnection.onmessage = this._onMessageFunct;
        }
    }
}

export {WsClient};