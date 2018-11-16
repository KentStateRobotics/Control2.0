/**
 * Commands to use with location module
 * @module control/location
 */
import {RemoteEvent, RemoteVarEvent} from "./js/remoteEvent.js";
   
/**Location of robot in the pit
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLoc = RemoteVarEvent("pitLoc", {"x": 0, "y": 0})

/**Location the robot is going to
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLocCom = RemoteVarEvent("pitLocComand", {"x": 0, "y": 0})

/**Preforms digging operation
 */
const locDoADig = RemoteEvent("locDoADig")

/**Cancels current location module operation
 */
const locCancel = RemoteEvent("locCancel")

export {pitLoc, pitLocCom, locDoADig, locCancel}