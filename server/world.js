import { IO } from "./main";

export class World
{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.players = {};

    }

    addPlayer(player){


        this.players[player.id] = player;

        console.log("player added");
        console.log(this.players);
    }

    removePlayer(socketId){

        delete this.players[socketId];

        console.log("player removed");
        console.log(this.players);
    }

    playerReady(socketId){
        let player = this.players[socketId];

        IO.to(`${socketId}`).emit("world_initial_data", {
            width: this.width,
            height: this.height
        })
        
    }

    update(dt){
        //console.log("updating", dt);

        //INPUT CHECK

        //UPDATE POSITIONS

        //CHECK COLLISIONS

        //GENERATE DATA TO SEND TO PLAYERS
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

    onPlayerMove(playerId, data){
        let player = this.players[playerId];

        player.position.x = data.x;
        player.position.y = data.y;
    }

    emit(){
        IO.emit("update", this.data);
    }
}