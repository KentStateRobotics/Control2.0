/**
* Commands to use with automomy module
* @module control/auto
*/
import {RemoteEvent, RemoteVarEvent} from "./js/remoteEvent.js";

/**Triggers to start automation
 * @prop {bool} [hasGravel] - is the robot currently carring gravel
 */
const startAuto = RemoteEvent("startAuto")

/**Triggers to stop automation
 */
const stopAuto = RemoteEvent("stopAuto")

/**Current status of the automaton module
 * @prop TODO
 */
const autoStatus = RemoteVarEvent("autoStatus", {})

export {startAuto, stopAuto, autoStatus};