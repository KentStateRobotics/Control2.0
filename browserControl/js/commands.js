/**
 * Commands to send to server
 * @module control/commands
 */
import * as ws from "./js/wsClient";

/**Sets the values of ws magic numbers
 * @function setMagicNumbers
 * @param {int} Kwarg.deadzone - Abs value for drive motors that less then will be rounded to 0
 * @param {float} Kwarg.rampTime - Time it takes to ramp from 0 to max in seconds
 */
const setMagicNumbers = ws.command('motor', 'setMagicNumbers', (kwargs={}) => {});

/**Called when values of ws magic numbers are received
 * @function getMagicNumbers
 * @param {int} deadzone - Abs value for drive motors that less then will be rounded to 0
 * @param {float} rampTime - Time it takes to ramp from 0 to max in seconds
 */
const getMagicNumbers = ws.clientRPC('motor', 'getMagicNumbers', (deadzone, rampTime) => {});

/**Sets the motor speed
 * @function setDriveSpeed
 * @param {int} right - -128:128 speed for right drive
 * @param {int} right - -128:128 speed for left drive
 * @param {bool} ramping - Use smooth ramping
 */
const setDriveSpeed = ws.command('motor', 'setDriveSpeed', (right, left, ramping=true) => {});

/**Called when motor speed is received 
 * @function getDriveSpeed
 * @param {int} right - -128:128 speed for right drive
 * @param {int} right - -128:128 speed for left drive
 */
const getDriveSpeed = ws.clientRPC('motor', 'getDriveSpeed', (right, left) => {});

/**Sets the digging arm's elbow and bucket angles
 * @function setArmAngle
 * @param {int} elbow
 * @param {int} bucket
 */
const setArmAngle = ws.command('motor', 'setArmAngle', (elbow, bucket) => {});

/**Called when digging arm's elbow and bucket angles are received
 * @function getArmAngle
 * @param {int} kwarg.elbow
 * @param {int} kwarg.bucket
 */
const getArmAngle = ws.command('motor', 'getArmAngle', (kwargs={}) => {});

/**Emergency stop of motors, commands will be ignored until released
 * @function stop
 * @param {bool} release - Release the stop command in effect
 */
const stop = ws.command('motor', 'stop', (release=false) => {});

/**Called when there is a stop command issued
 * @function notifyOfStop
 */
const notifyOfStop = ws.clientRPC('motor', 'notifyOfStop', () => {});