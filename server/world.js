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
        
        this.player_direction = V2.create();

        //this.add_collisions(this.map.props);
        //this.add_spawn_points(this.map.props);
        //this.add_interactive_objects(this.map.props);
    }

    addPlayer(socket){
        this.players[socket.id] = create_player("player_" + socket.id.toString(), socket, {x:0, y:0});
        console.log("player added");
        
        this.gos.push( this.players[socket.id] );

        //EVENTS
        socket.on( 'disconnect',    this.removePlayer.bind(this, socket) );
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

        // cuando el jugador avisa que está listo, el server le envía sus datos
        socket.on( 'player_ready',  this.playerReady.bind(this, socket.id, data) );

        console.log(this.players);
    }

    removePlayer(socket){
        
        //delete this.players[socket.id];

        socket.broadcast.emit("player_disconnect", socket.id);
        this.removeGos.push(socket.id);
        //currentUsers--;
        console.log("player removed", socket.id);
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
        for (let id in this.players) {
            // PLAYERS MOVEMENTS
            
            if (V2.length(this.players[id].rigidbody.new_direction) > 0) {
                this.players[id].rigidbody.acceleration.x = this.players[id].rigidbody.new_direction.x * 200//FILES.config.gameplay.player_speed;
                this.players[id].rigidbody.acceleration.y = this.players[id].rigidbody.new_direction.y * 200//FILES.config.gameplay.player_speed;
            }
        }

        //UPDATE POSITIONS
        for (let i=0; i < this.gos.length; i++){
            let gobj = this.gos[i];
            gobj.update(dt);
            update_physics(dt, gobj.transform, gobj.rigidbody, gobj.collider);
        }

        //CHECK COLLISIONS
        for (let i = 0; i < this.gos.length; i++) {
            let gobj = this.gos[i];
            for (let j = 0; j < this.gos.length; j++) {
                let othergobj = this.gos[j];
                if (gobj !== othergobj) {
                    check_collision(dt, gobj, othergobj);
                }
            }
        }

        for (let i = 0; i < this.removeGos.length; i++) {
            this.gos.splice(this.gos.indexOf(this.players[this.removeGos[i]]), 1);
            delete this.players[this.removeGos[i]];
        }
        this.removeGos.length = 0;

        //GENERATE DATA TO SEND TO PLAYERS
        this.generatePlayerData(dt);
    }

    onPlayerMove(playerId, click_pos){

        console.log(click_pos)

        let player = this.players[playerId];

        this.player_direction.x = click_pos.x - player.transform.position.x;
        this.player_direction.y = click_pos.y - player.transform.position.y;

        
        V2.normalize(this.player_direction, player.rigidbody.new_direction);
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

    generatePlayerData(dt){
        this.data.length = 0;
        for (let i = 0; i < this.gos.length; i++) {
            let gobj = this.gos[i];
            resolve_collisions(dt, gobj, this.onCollision.bind(this));

            if (gobj.sendable) {
                this.data.push(gobj.get_literal());
            }
        }
    }

    onCollision(objA, objB, side) {
        console.log(objA, objB, side);
    }

    emit(){
        
        IO.emit("update", this.data);
    }
}