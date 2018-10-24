/**
 * An event class and a var event class that triggers when value is set
 * @module control/event
 */
'use strict'

class event{
    /**@class
     * Used to define local events
     */
    constructor(){
        this.handlers = [];
    }
    trigger(evt){
        this.handlers.forEach((handler) => {
            handler(evt);
        });
    }
    addHandler(handler){
        this.handlers.push(handler);
    }
    removeHandler(handler){
        this.handlers.splice(0, 1, handler);
    }
    removeAllHandlers(){
        this.handlers = [];
    }
}

class varEvent extends event{
    /**@class
     * Used to define local events
     */
    constructor(attribute){
        super();
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
}

export{event, varEvent};