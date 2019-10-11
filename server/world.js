import { IO } from "./main";
import { check_collision, resolve_collisions, update_physics } from './physics';
import { create_player, create_wall } from './factory';
import { V2 } from './utils/vector2d';

export class World
{
    constructor(width, height){
        this.width = width;
        this.height = height;

        
        this.data = [];
        this.players = {};

        this.gos = [];
        this.removeGos = [];
        
        this.v2_diff = V2.create();

        //this.add_collisions(this.map.props);
        //this.add_spawn_points(this.map.props);
        //this.add_interactive_objects(this.map.props);
    }

    addPlayer(socket){
        this.players[socket.id] = create_player("player_" + socket.id.toString(), socket, {x:0, y:0});
        console.log("player added");
        
        this.gos.push( this.players[socket.id] );

        //EVENTS
        socket.on( 'disconnect',    this.removePlayer.bind(this, socket.id) );
        socket.on( 'player_move',   this.onPlayerMove.bind(this, socket.id) );

        console.log("events registered");

        // Envía datos del jugador que se acaba de crear al resto de los jugadores.
        let data = {};
        this.players[socket.id].get_literal(data);
        this.players[socket.id].get_stats(data);

        console.log("player data stored", data);

        // sending to all clients except sender
        socket.broadcast.emit('player_connected', data);

        console.log("data broadcasted to other players");

        // cuando el jugador avisa que está listo, le envía sus datos
        socket.on( 'player_ready',  this.playerReady.bind(this, socket.id, data) );

        console.log(this.players);
    }

    removePlayer(socketId){
        delete this.players[socketId];
        console.log("player removed", socketId);
    }

    playerReady(socketId, player_data){
        //let player = this.players[socketId];
        
        // Le envia el mapa (AUN NO HAY MAPA) y datos iniciales al nuevo jugador
        let map_data = {
            width: this.width,
            height: this.height
        }

        IO.to(`${socketId}`).emit("world_initial_data", {
            map_data: map_data,
            player: player_data,
            other_players: this.getOtherPlayers(socketId)
        })
    }

    update(dt){
        //console.log("updating", dt);

        //INPUT CHECK

        //UPDATE POSITIONS
        for (let id in this.players){
            
            this.players.x 
        }

        //CHECK COLLISIONS

        //GENERATE DATA TO SEND TO PLAYERS
        this.generatePlayerData();
    }

    onPlayerMove(playerId, data){
        let player = this.players[playerId];
        console.log(data);
/*        player.destination.x = data.x;
        player.destination.y = data.y;

        player.direction = {
            x: player.destination.x - player.position.x,
            y: player.destination.y - player.position.y
        }*/
    }

    getOtherPlayers(socketId){
        let players = [];
        for (let other_id in this.players){
            if ( other_id !== socketId ){
                let data = {};
                this.players[other_id].get_literal(data);
                this.players[other_id].get_stats(data);
                players.push(data);
            }
        }

        return players;
    }

    generatePlayerData(){
        let data = {
            players: {}
        };
        for (var sId in this.players){
            data.players[sId] = {
                position: this.players[sId].position
            }
        }

        this.data = data;
    }

    emit(){
        IO.emit("update", this.data);
    }
}