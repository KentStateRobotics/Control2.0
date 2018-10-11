/**
 * Commands to use with location module
 * @module control/location
 */
import * as ws from "./js/wsClient";
   
/**Move robot to position relitive to bin
 * @function goTo
 * @param {float} x - x position (width of bin) to travel to in meters
 * @param {float} y - y position (length of bin) to travel to in meters
 */
const goTo = ws.command('location', 'goTo', (x, y) => {});

/**Query the robots current position relitive to bin
 * @function getPosition
 */
/**Get the robots current position relitive to bin
 * @callback getPosition
 * @param {float} x - x position (width of bin) in meters
 * @param {float} y - y position (length of bin) in meters
 */
const getPosition = ws.query('location', 'getPosition', () => {}, (x, y) => {});

/**Preforms the digging operation
 * @function doADig
 */
const doADig = ws.command('location', 'doADig', () => {});

/**Preforms the digging operation
 * @function cancle
 */
const cancel = ws.command('location', 'cancle', () => {});

export {goTo, getPosition, doADig, cancel}