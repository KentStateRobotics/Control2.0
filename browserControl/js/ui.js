/**
 * Handles interactions with html elements and buttons and video stream
 * @module control/ui
 */

import {remoteEvent, remoteVarEvent} from "./remoteEvent.js";
import {reconnect as camRecon} from "./camera.js";
import * as graphicalStatus from "./graphicalStatus.js";

remoteEvent.getWsStateEvt().addHandler((state) => {
    if(state == 1){
        document.getElementById("UiNotConnected").style.display = "none";
        document.getElementById("UiConnected").style.display = "inherit";
    } else {
        document.getElementById("UiNotConnected").style.display = "inherit";
        document.getElementById("UiConnected").style.display = "none";
    }
});

function reconnect(){
    remoteEvent.reconnect(document.getElementById("hostAddress").value);
    camRecon(document.getElementById("hostAddress").value);
}
document.getElementById("hostAddress").value = window.location.hostname;
document.getElementById("reconnectButton").onclick = reconnect;