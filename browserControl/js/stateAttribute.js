/**
 * Holds and manages state and other infomation about the robot
 * @module control/stateAttribute
 */
class stateAttribute{
    /**@class
     * Used to manage data about state
     * @param {object} attribute - Object that defines the data being held by class and default values
     * @example 
     * const robotSpeed = stateAttribute({port: 0, star: 0});
     */
    constructor(attribute){
        this.onUpdate = [];
        this.atribute = attribute;
    }
    /**@function
     * Get copy of data being stored
     * @returns {object} - copy of data being stored
     */
    get() {
        return {...this.atribute};
    }
    /**@method
     * sets the data and runs the onUpdate event
     * @param {object} values - object containing key value pairs coresponding to points to update
     */
    set(values){
        Object.keys(values).forEach(key => {
            if(!key in this.atribute) throw Error('Key not found in attribute');
            this.atribute[key] = values[key];
        });
        this.onUpdate.forEach(element => {
            element(...this.atribute);
        });
    }
    /**@method
     * Add an event handler to be ran on update of values
     * @param {function(object)} funct - function to run, receives copy of data being sotred
     */
    addOnUpdate(funct){
        this.onUpdate.push(funct);
    }
    /**@method
     * Removes one or all functions attached to onUpdate event
     * @param {function(object), optional} funct - Function to remove from hander, if none is given remove all
     */
    removeOnUpdate(funct=null){
        if(funct){
            this.onUpdate.splice(this.onUpdate.indexOf(funct), 1);
        } else {
            this.onUpdate = [];
        }
    }
}

export {stateAttribute};