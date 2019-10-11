import express from 'express';
import http from 'http';
import io from 'socket.io';
import { World } from './world';
import { Player } from './player';


const APP = express();
const HTTP = http.createServer(APP);
export const IO = io(HTTP);

const world = new World(400, 400);

APP.use('/', express.static("./client"));

IO.on('connection', function(socket){
	console.log("user connected");
	let player = new Player(socket);
	world.addPlayer(player);

	socket.on('disconnect', function(){
		console.log("user disconnected");
		world.removePlayer(socket.id);
	});

	//EVENTS

	socket.on( 'player_ready', ()=>{
		console.log("Player Ready")
		world.playerReady(socket.id);
	});


	socket.on( 'player_move', (data)=>{
		console.log("player moved", data);
		world.onPlayerMove( socket.id, data );
	});
});

HTTP.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});


function player_ready(data){
	console.log(data);
}

const DT = 1/60;
let ticks = 0;

setInterval( ()=>{
	world.update(DT);

	ticks++;
	if (ticks % 10 === 0){
		world.emit();
	}

}, DT * 1000);