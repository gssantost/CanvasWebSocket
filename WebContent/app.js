//Función de ayuda
const $ = id => document.getElementById(id);
console.log("Whiteboard is ready");
    let mouse = {
        click: false,
        move: false
    }

    let coords = {
        prevX: 0, prevY:0,
        x:0, y:0,
        
    }      
const canvas = $("whiteboard");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
// Eventos del lienzo
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
        ws.send(JSON.stringify(coords)); // envío objeto de coordenadas a
											// través del WebSocket
    }
}


const draw = (line) => {
	let col = $("jscolor").value;
	console.log(col);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.strokeStyle= "#" + col;
	// var colors = ['red', 'green', 'blue', 'orange', 'yellow'];
	// ctx.strokeStyle= colors[Math.floor(Math.random() * colors.length)];
    // ctx.strokeStyle= "#"+((1<<24)*Math.random()|0).toString(16);
    ctx.moveTo(line.prevX, line.prevY);
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
    coords.prevX = line.x;
    coords.prevY = line.y;
}



// Conexión al WebSocket
let ws;
let colr = $("jscolor").value;
const connect = () => {
    ws = new WebSocket("ws://" + location.host + "/CanvasWebSocket/paint/" + $("username").value);

    ws.onmessage = e => {
        // console.log(JSON.parse(e.data));
        let line = JSON.parse(e.data);
        draw(line);
       let users = JSON.parse(e.data).usrs;
       		  for (let key in users) { 
       			  $("users").innerHTML += `${users[key]} is online...!<br>`; 
       		  }
    }
    
    ws.onopen = e => {
        console.log("Connected!");
      	if($("jscolor").value === "FFFFFF"){
      		alert("Estas a punto de pintar en blanco, si deseas, puedes cambiar el color!");
      	}else{
      		alert("Empieza a pintar!");
      	}
    }
    
    ws.onclose = e => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log("Disconnected!");
            console.log(JSON.parse(e.data));
            ws.close();
        }
        
     ws.onerror = e => {
    	 console.log("Ha habido un error en la comunicacion",e.data);
     }   
    }
}
const logout = () => {
    ws.close();
    console.log("Haz Join! para dibujar");
    alert("vuelve pronto!")
}

const clear = () =>{
	const canvas = $("whiteboard");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, width, height);
}
// Event Listeners
$("connectBtn").addEventListener("click", connect);
$("disconnectBtn").addEventListener("click", logout);
$("clearBtn").addEventListener("click", clear);
