/**
 * An event class and a var event class that triggers when value is set
 * @module control/event
 */
'use strict'

class Event {
    /**@class
     * Used to define local events
     * @param {function(evt)} [handler] - Optional inital handler
     */
    constructor(handler=null){
        this.handlers = [];
        if(handler){
            this.addHandler(handler);
        }
    }
    /**
     * Calls all attached event handlers
     * @param {*} evt - Object to pass with event
     */
    trigger(evt){
        this.handlers.forEach((handler) => {
            handler(evt);
        });
    }
    /**
     * Attaches function to event, is passed whatever parameter is given with event trigger
     * @param {function(evt)} handler - fucntion to attach
     */
    addHandler(handler){
        this.handlers.push(handler);
    }
    /**
     * Removes given event handler or all handlers if none if given
     * @param {function(evt)} [handler] - Handler to remove 
     */
    removeHandler(handler=null){
        if(handler){
            this.handlers.splice(0, 1, handler);
        }else{
            this.handlers = [];
        }
    }
}

class VarEvent extends Event{
    /**@class
     * Used to define local events
     * @param {function(evt)} [handler] - Optional inital handler
     */
    constructor(attribute, handler=null){
        super(handler);
        this.attribute = attribute
    }
    trigger(){
        super.trigger(this.attribute);
    }
    set(attribute){
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
        super.trigger(this.attribute);
    }
    get(){
        return this.attribute;
    }
    getCopy(){
        return JSON.parse(JSON.stringify(this.attribute));
    }
}

export{Event, VarEvent};