//Función de ayuda
const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", e => {
    console.log("Whiteboard is ready");
    let mouse = {
        click: false,
        move: false,
        pos: {x:0, y:0},
        prev: {x:0, y:0}
    }
    const canvas = $("whiteboard");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.onmousedown = e => {
        mouse.click = true;
        mouse.prev = {x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop};
    }
    canvas.onmouseup = e => {
        mouse.click = false;
    }
    canvas.onmousemove = e => {
        mouse.move = true;
        if (mouse.click) {
            mouse.pos.x = e.pageX - canvas.offsetLeft;
            mouse.pos.y = e.pageY - canvas.offsetTop;
            draw(mouse.prev, mouse.pos); //LA ACCIÓN DE DIBUJAR MOMENTANÉAMENTE AQUÍ
        }
    }
    const draw = (coords, coordsNew) => {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(coordsNew.x, coordsNew.y);
        ctx.stroke();
        coords.x = coordsNew.x;
        coords.y = coordsNew.y;
    }
})

//Conexión al WebSocket
let ws;
const connect = () => {
    ws = new WebSocket("ws://" + location.host + "/CanvasWebSocket/board/" + $("username").value);
    ws.onopen = e => console.log("Connected!");
    ws.onmessage = e => console.log(JSON.parse(e.data));
    ws.onclose = e => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log("Disconnected!");
            ws.close();
        }
    }
}
const logout = () => {
    ws.close();
}

$("connectBtn").addEventListener("click", connect);
$("disconnectBtn").addEventListener("click", logout);