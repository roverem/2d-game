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

        this.data = {
            x: Math.floor( Math.random() * this.width ),
            y: Math.floor( Math.random() * this.height )
        }
    }

    emit(){
        IO.emit("update", this.data);
    }
}