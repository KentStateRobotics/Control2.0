/**
 * Handles interactions with html elements and buttons and video stream
 * @module control/graphicalStatus
 */

const _canvas = document.getElementById("statusCanvas").getContext("2d");
const LINE_WIDTH = 12;
const ARROW_POINT_LENGTH = 25;
const ARROW_POINT_ANGLE = 1;
function drawArrow(sX, sY, dX, dY){
    let angle = Math.atan2(dY-sY, dX-sX);
    _canvas.beginPath();
    _canvas.lineCap = "round";
    _canvas.moveTo(dX,dY);
    _canvas.lineTo(dX - Math.cos(angle + ARROW_POINT_ANGLE) * ARROW_POINT_LENGTH, dY - Math.sin(angle + ARROW_POINT_ANGLE) * ARROW_POINT_LENGTH);
    _canvas.moveTo(dX,dY);
    _canvas.lineTo(dX - Math.cos(angle - ARROW_POINT_ANGLE) * ARROW_POINT_LENGTH, dY - Math.sin(angle - ARROW_POINT_ANGLE) * ARROW_POINT_LENGTH);
    _canvas.stroke();
}

function drawLine(color){
    let sX = _canvas.canvas.width / 2;
    let dX = sX;
    let dY = 20;
    let sY = _canvas.canvas.height - dY;
    _canvas.beginPath();
    _canvas.lineWidth = LINE_WIDTH;
    _canvas.strokeStyle = color;
    _canvas.moveTo(sX, sY);
    _canvas.lineTo(dX, dY);
    _canvas.stroke();
    drawArrow(sX, sY, dX, dY);
}

window.drawLine = drawLine;
drawLine("red");