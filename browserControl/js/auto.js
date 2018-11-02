/**
* Commands to use with automomy module
* @module control/auto
*/
import {remoteEvent, remoteVarEvent} from "./js/remoteEvent.js";

/**Triggers to start automation
 * @prop {bool} [hasGravel] - is the robot currently carring gravel
 */
const startAuto = remoteEvent("startAuto")

/**Triggers to stop automation
 */
const stopAuto = remoteEvent("stopAuto")

/**Current status of the automaton module
 * @prop TODO
 */
const autoStatus = remoteVarEvent("autoStatus", {})

export {startAuto, stopAuto, autoStatus};