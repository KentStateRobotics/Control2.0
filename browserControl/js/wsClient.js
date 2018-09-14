/**
 * Handles establishing a websocket connection and commands
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module control/wsClient
 */

function command(name, funct){
    return function(){
        funct.apply(this, arguments);
    }
}

function clientRPC(name, funct, blob=false){
    return function(){
        funct.apply(this, arguments);
    }
}

/*
Example

var foo = command('foo', (x, y, z=true) => {
});
*/