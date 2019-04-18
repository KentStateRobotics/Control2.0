/**
* Commands to use with automomy module
* @module control/auto
*/
import {RemoteEvent, RemoteVarEvent} from "./remoteEvent.js";

/**Triggers to start automation
 * @prop {bool} [hasGravel] - is the robot currently carring gravel
 */
const startAuto = new RemoteEvent("startAuto")

/**Triggers to stop automation
 */
const stopAuto = new RemoteEvent("stopAuto")

/**Current status of the automaton module
 * @prop TODO
 */
const autoStatus = new RemoteVarEvent("autoStatus", {})

export {startAuto, stopAuto, autoStatus};