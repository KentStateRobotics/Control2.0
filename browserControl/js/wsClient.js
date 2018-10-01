/**
 * Handles establishing a websocket connection and commands
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */

const PORT = 4242;
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
        data['args'] = arguments;
        _wsConnection.send(JSON.stringify(data));
        funct.apply(arguments);
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
    _commands[context][name] = funct;
    return function(){
        if(blob) {
            _expectBlob = [funct, arguments];
        }
        else {
            funct.apply(arguments);
        }
    }
}

_wsConnection.onopen = (evt) => {

};

_wsConnection.onmessage = (evt) => {
    if(_expectBlob){
        _expectBlob[0].apply([_expectBlob[1],evt.data]);
    }else{
        try{
            let data = JSON.parse(evt.data);
            _commands[data['context']][data['funct']].apply(data['args']);
        }catch(e){
            console.log(e);
            return;
        }
    }
};

function _start(){
    _wsConnection = new WebSocket('ws://' + window.location.hostname + ':' + PORT);
}

_start();

export{command, clientRPC};