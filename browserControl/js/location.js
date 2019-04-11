/**
 * Commands to use with location module
 * @module control/location
 */
import {RemoteEvent, RemoteVarEvent} from "./remoteEvent.js";

/**Location of robot in the pit
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLoc = new RemoteVarEvent("pitLoc", {"x": 0, "y": 0})

/**Location the robot is going to
 * @prop {float} x - X location
 * @prop {float} y - Y location
 */
const pitLocCom = new RemoteVarEvent("pitLocComand", {"x": 0, "y": 0})

/**Preforms digging operation
 */
const locDoADig = new RemoteEvent("locDoADig")

/**When close to bin will move to proper postion and preform dumping operation
 */
const locDoADump = new RemoteEvent("locDoADump")

/**Cancels current location module operation
 */
const locCancel = new RemoteEvent("locCancel")

export {pitLoc, pitLocCom, locDoADig, locDoADump, locCancel}