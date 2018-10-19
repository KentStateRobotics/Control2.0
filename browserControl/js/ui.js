/**
 * Handles interactions with html elements and buttons and video stream
 * @module control/ui
 */

 import * as ws from "./wsClient.js";

ws.setOnOpen((evt) => {
    document.getElementById("UiNotConnected").style.display = "none";
    document.getElementById("UiConnected").style.display = "inherit";
});

ws.setOnClose((evt) => {
    document.getElementById("UiNotConnected").style.display = "inherit";
    document.getElementById("UiConnected").style.display = "none";
});