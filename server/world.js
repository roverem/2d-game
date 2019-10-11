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
        
        this.gos.push( this.players[socket.id] );

        //EVENTS
        socket.on( 'disconnect', this.removePlayer.bind(this, socket.id) );

        socket.on( 'player_ready', this.playerReady.bind(this, socket.id) );


        socket.on( 'player_move', this.onPlayerMove.bind( this, socket.id ) );

        console.log("player added");
        console.log(this.players);
    }

    removePlayer(socketId){
        delete this.players[socketId];

        console.log("player removed", socketId);
    }

    playerReady(socketId){
        //let player = this.players[socketId];

        IO.to(`${socketId}`).emit("world_initial_data", {
            width: this.width,
            height: this.height
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