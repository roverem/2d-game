import express from 'express';
import http from 'http';
import io from 'socket.io';
import { World } from './world';
import { Player } from './player';


const APP = express();
const HTTP = http.createServer(APP);
export const IO = io(HTTP);

const world = new World(400, 400);
const DT = 1/60;
let ticks = 0;

let current_users = 0;
let max_users = 100;
let socket_url = "http://localhost:3000";
let socket_path = "/socket.io";

APP.use('/', express.static("./client"));
APP.get('/users/settings.js', (req, res) => {
    res.set('Content-Type', 'text/javascript;charset=UTF-8');
    res.send('export const SETTINGS = {current_users:' + current_users + ' , max_users:' + max_users + ', url:"' + socket_url + '", path:"' + socket_path + '"};');
});

IO.set('transports', ['websocket']);
IO.on('connection', function(socket){
	console.log("user connected");
	
	world.addPlayer(socket);
});

HTTP.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});

setInterval( ()=>{
	world.update(DT);

	ticks++;
	if (ticks % 10 === 0){
		world.emit();
	}

}, DT * 1000);