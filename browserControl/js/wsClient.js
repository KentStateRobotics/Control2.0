/**
 * Handles establishing a websocket connection and commands
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */

 /**
  * Decorator to use for client to server commands
  * @param {string} context - Name of functions namespace
  * @param {string} name - Name of function
  * @param {function} funct - Function to decorate
  * @example
  * const functionName = command('contextName', functionName', (x, y, kwargs={}) => {do stuff});
  */
function command(context, name, funct){
    return function(){
        let data = {};
        data['context'] = context;
        data['funct'] = name;
        funct.apply(this, arguments);
    }
}

 /**
  * Decorator to mark functions that can be called here from server
  * @param {string} context - Name of functions namespace
  * @param {string} name - Name of function
  * @param {function} funct - Function to decorate
  * @param {bool} blob - Does this function expect a blob, if so it will be passed in kwargs with key blob
  * @example
  * const functionName = clientRPC('contextName', 'functionName', (x, y, kwargs={}) => {do stuff}, true);
  */
function clientRPC(context, name, funct, blob=false){
    return function(){
        funct.apply(this, arguments);
    }
}

export{command, clientRPC};