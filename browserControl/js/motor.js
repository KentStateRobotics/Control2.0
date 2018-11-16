/**
 * Commands to use with motor module
 * @module control/motor
 */
import {RemoteEvent, RemoteVarEvent} from "./js/remoteEvent.js";

/**Allows remote setting of magic numbers
 * @prop {int} deadzone - Abs value for drive motors that less then will be rounded to 0
 * @prop {float} rampTime - Time it takes to ramp from 0 to max in seconds
 */
motorSettings = RemoteVarEvent("motorSettings", {"deadzone": 0, "rampTime": 0, "ramping": True});

/**Current speed of the motors
 * @prop {float} port - -1:1 Speed of port motors
 * @prop {float} star - -1:1 Speed of starboard motors
 */
motorSpeed = RemoteVarEvent("motorSpeed", {"port": 0, "star": 0})

/**Target speed of the motors
 * @prop {float} port - -1:1 Target speed of port motors
 * @prop {float} star - -1:1 Target speed of starboard motors
 */
motorSpeedCom = RemoteVarEvent("motorSpeedCom", {"port": 0, "star": 0})

/**Postioton of arm and bucket
 * @prop {int} elbow - angular position for arm
 * @prop {int} bucket - angular position for bucket
 */
armAngle = RemoteVarEvent("armAngle", {"elbow": 0, "bucket": 0})

/**Target postioton of arm and bucket
 * @prop {int} elbow - Target angular position for arm
 * @prop {int} bucket - Target angular position for bucket
 */
armAngleCom = RemoteVarEvent("armAngleCom", {"elbow": 0, "bucket": 0})

/**Emergency stop for all motors and will ignore all move commands until released
 * @param {bool} - True to stop, false to release
 */
motorStop = RemoteVarEvent("motorStop", False)

export{motorSettings, motorSpeed, motorSpeedCom, armAngle, armAngleCom, motorStop};