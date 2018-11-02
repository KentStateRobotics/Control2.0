/**
 * Commands to use with location module
 * @module control/location
 */
import {remoteEvent, remoteVarEvent} from "./js/remoteEvent.js";
   
/**Location of robot in the pit
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLoc = remoteVarEvent("pitLoc", {"x": 0, "y": 0})

/**Location the robot is going to
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLocCom = remoteVarEvent("pitLocComand", {"x": 0, "y": 0})

/**Preforms digging operation
 */
const locDoADig = remoteEvent("locDoADig")

/**Cancels current location module operation
 */
const locCancel = remoteEvent("locCancel")

export {pitLoc, pitLocCom, locDoADig, locCancel}