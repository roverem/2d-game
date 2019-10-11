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


APP.use('/', express.static("./client"));

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