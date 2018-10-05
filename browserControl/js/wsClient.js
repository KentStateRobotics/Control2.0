/**
 * Handles establishing a websocket connection and commands
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */

const _PORT = 4242;
const _DEBUG = true;
var _wsConnection;
var _commands = {};
var _expectBlob;

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
  * Overrides the websocket on open eventhandler
  * @param {function} funct(websocketEvent) - function to run
  */  
function setOnOpen(funct){
    _wsConnection.onopen = funct;
}

/**
  * Overrides the websocket on close eventhandler
  * @param {function} funct(websocketEvent) - function to run
  */  
function setOnClose(funct){
    _wsConnection.onclose = funct;
}

function _start(){
    _wsConnection = new WebSocket('ws://' + window.location.hostname + ':' + _PORT);
    _wsConnection.onopen = (evt) => {
        if(_DEBUG){
            commandTest('test string');
        }
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
        setTimeout(_start, 1000);
    }
}

 /**
  * Test the command system, will echo the paramter given in clientRPCBlobTest
  * @param {var} a - some value to echo
  */  
const commandTest = command('wsServer', 'commandTest', (a) => {
    console.log("command test: " + a);
});
window.commandTest = commandTest;

const clientRPCTest = clientRPC('wsServer', 'clientRPCTest', (a) => {
    console.log("client rpc test: " + a);
});

const clientRPCBlobTest = clientRPC('wsServer', 'clientRPCBlobTest', (a, blob) => {
    console.log("client rpc blob test: " + a);
    console.log("blob: " + blob);
}, true);

_start();

export{command, clientRPC, commandTest, setOnOpen, setOnClose};