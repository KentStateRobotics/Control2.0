/**
* Commands to use with automomy module
* @module control/auto
*/
import * as ws from "./js/wsClient";
   
/**Starts the autonomy routine
 * @function start
 * @param {bool} hasGravel - is the robot currently carrying gravel? Tells it wether it need to go dump or go dig first
 */
const start = ws.command('auto', 'start', (hasGravel) => {});

/**Stops the autonomy routine
 * @function stop
 */
const stop = ws.command('auto', 'stop', () => {});

/**Request for status info
 * @function getPosition
 */
/**Called when autonomy status info is received
 * @callback getPosition
 * @param {} status - xstatus info of somesort
 */
const getStatus = ws.query('auto', 'getStatus', () => {}, (status) => {});