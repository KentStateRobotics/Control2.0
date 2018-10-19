/**
 * Handles establishing a websocket connection and commands
 * Automaticly tries to connect to the window address when imported
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */

const _PORT = 4242;
const _DEBUG = true;
const _TIMEOUT = 1000;
const _RETRIES = 3;
var _wsConnection;
var _commands = {};
var _expectBlob;
var _connFailueCounter = 0;
var _onOpen = (evt) => {};
var _onClose = (evt) => {};

 /**
  * Decorator to use for client to server commands
  * @param {string} context - Name of functions namespace
  * @param {string} name - Name of function
  * @param {function} funct - Function to decorate
  * @example
  * const functionName = command('contextName', functionName', (x, y) => {do stuff});
  */
function command(context, name, funct){
    return function(){
        let data = {};
        data['context'] = context;
        data['funct'] = name;
        data['args'] = Object.values(arguments);
        _wsConnection.send(JSON.stringify(data));
        funct(...data['args']);
    }
}

 /**
  * Decorator to mark functions that can be called here from server
  * @param {string} context - Name of functions namespace
  * @param {string} name - Name of function
  * @param {function} funct - Function to decorate
  * @param {bool} blob - Does this function expect a blob, if so it will be passed in kwargs with key blob
  * @example
  * const functionName = clientRPC('contextName', 'functionName', (x, y) => {do stuff}, true);
  */    
function clientRPC(context, name, funct, blob=false){
    if(!_commands[context]){
        _commands[context] = {}
    }
    _commands[context][name] = function(){
        if(blob) {
            _expectBlob = [funct, Object.values(arguments)];
        }
        else {
            funct(...Object.values(arguments));
        }
    }
    return _commands[context][name];
}

 /**
  * Decorator to mark functions that can be called here from server and will have a callback
  * @param {string} context - Name of functions namespace
  * @param {string} name - Name of function
  * @param {function} funct - Function to decorate
  * @param {function} callback - Function call with response
  * @param {bool} blob - Does this function expect a blob, if so it will be passed in kwargs with key blob
  * @example
  * const functionName = query('contextName', 'functionName', (x, y) => {do stuff}, (z, w) => {do stuff with new data}, true);
  */   
function query(context, name, funct, callback, blob=false){
    clientRPC(context, name, callback, blob);
    return command(context, name, funct);
}

 /**
  * Overrides the websocket on open eventhandler
  * @param {function} funct(websocketEvent) - function to run
  */  
function setOnOpen(funct){
    _onOpen = funct;
}

/**
  * Overrides the websocket on close eventhandler
  * @param {function} funct(websocketEvent) - function to run
  */  
function setOnClose(funct){
    _onClose = funct;
}

/**
 * Returns the ready state of connection
 * @returns {int} ready state:
 * 0 - connecting
 * 1 - open
 * 2 - closeing
 * 3 - closed
 */
function getReadyState(){
    return _wsConnection.readyState;
}

/**
 * Closes connection
 */
function closeConnection(){
    _wsConnection.close();
}

/**
 * Establishes the connection
 * @param {string} host - Address of host 
 */
function start(host=window.location.hostname){
    _wsConnection = new WebSocket('ws://' + host + ':' + _PORT);
    _wsConnection.onopen = (evt) => {
        _connFailueCounter = 0;
        if(_DEBUG){
            queryBlobTest('test string');
        }
        _onOpen(evt);
    };
    _wsConnection.onmessage = (evt) => {
        if(_expectBlob){
            _expectBlob[0](..._expectBlob[1],evt.data);
            _expectBlob = null;
        }else{
            try{
                let data = JSON.parse(evt.data);
                _commands[data['context']][data['funct']](...data['args']);
            }catch(e){
                console.log(e);
                return;
            }
        }
    };
    _wsConnection.onclose = (evt) => {
        console.log(evt);
        ++_connFailueCounter;
        if(_connFailueCounter > _RETRIES){
            setTimeout(start, _TIMEOUT);
        } else {
            _onClose(evt);
        }
    }
}

 /**
  * Test the command system, will echo the paramter given in clientRPCBlobTest
  * @param {var} a - some value to echo
  */  
const commandTest = command('wsTest', 'commandTest', (a) => {
    console.log("command test: " + a);
});
window.commandTest = commandTest;

const clientRPCTest = clientRPC('wsTest', 'clientRPCTest', (a) => {
    console.log("client rpc test: " + a);
});
window.clientRPCTest = clientRPCTest;

const clientRPCBlobTest = clientRPC('wsTest', 'clientRPCBlobTest', (a, blob) => {
    console.log("client rpc blob test: " + a);
    console.log("blob: " + blob);
}, true);
window.clientRPCBlobTest = clientRPCBlobTest;

const queryTest = query('wsTest', 'queryTest', (a) => {
    console.log("querry sent: " + a);
}, (a) => {
    console.log("querry received: " + a);
});
window.queryTest = queryTest;

const queryBlobTest = query('wsTest', 'queryBlobTest', (a) => {
    console.log("querry sent: " + a);
}, (a, blob) => {
    console.log("querry received: " + a);
    console.log("blob: " + blob);
}, true);
window.queryBlobTest = queryBlobTest

start();

export{command, clientRPC, query, setOnOpen, setOnClose, getReadyState, closeConnection, start};