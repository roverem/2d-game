import express from 'express';
import http from 'http';
import io from 'socket.io';
import { World } from './world';
import { Player } from './player';


const APP = express();
const HTTP = http.createServer(APP);
const IO = io(HTTP);

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

	socket.on( 'player_ready', player_ready.bind(this) );
});

HTTP.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});


function player_ready(data){
	console.log(data);
}