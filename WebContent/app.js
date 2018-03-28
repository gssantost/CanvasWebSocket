//Función de ayuda
const $ = id => document.getElementById(id);
console.log("Whiteboard is ready");
    let mouse = {
        click: false,
        move: false
    }
    let coords = {
        prevX: 0, prevY:0,
        x:0, y:0
    }    
const canvas = $("whiteboard");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
//Eventos del lienzo
canvas.onmousedown = e => {
    mouse.click = true;
    coords.prevX = e.pageX - canvas.offsetLeft;
    coords.prevY = e.pageY - canvas.offsetTop;
}
canvas.onmouseup = e => {
    mouse.click = false;
}
canvas.onmousemove = e => {
    mouse.move = true;
    if (mouse.click) {
        coords.x = e.pageX - canvas.offsetLeft;
        coords.y = e.pageY - canvas.offsetTop;
        ws.send(JSON.stringify(coords)); //envío objeto de coordenadas a través del WebSocket
    }
}
const draw = (line) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.moveTo(line.prevX, line.prevY);
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
    coords.prevX = line.x;
    coords.prevY = line.y;
}
//Conexión al WebSocket
let ws;
const connect = () => {
    ws = new WebSocket("ws://" + location.host + "/CanvasWebSocket/paint/" + $("username").value);

    ws.onmessage = e => {
        //console.log(JSON.parse(e.data));
        let line = JSON.parse(e.data);
        draw(line);
        let users = JSON.parse(e.data).usrs;
        for (let key in users) {
            $("users").innerHTML += `${users[key]} is online...!<br>`;
        }
    }

    ws.onopen = e => {
        console.log("Connected!");
    }
    
    ws.onclose = e => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log("Disconnected!");
            console.log(JSON.parse(e.data));
            ws.close();
        }
    }
}
const logout = () => {
    ws.close();
}
//Event Listeners
$("connectBtn").addEventListener("click", connect);
$("disconnectBtn").addEventListener("click", logout);